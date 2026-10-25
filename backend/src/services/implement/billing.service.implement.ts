import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IOrderRepository } from '../../outbound/order-repository.port';
import type { IPaymentGatewayPort } from '../../outbound/payment-gateway.port';
import type { IUserRepository } from '../../outbound/user-repository.port';
import type { IInvitationRepository } from '../../outbound/invitation-repository.port';
import type { CheckoutResult, IBillingService, SubscriptionStatus } from '../billing.service';

const PLAN_PRICES: Record<string, number> = {
  PRO: 49000,
};

export class BillingServiceImplement implements IBillingService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly paymentGateway: IPaymentGatewayPort,
    private readonly userRepo: IUserRepository,
    private readonly invitationRepo?: IInvitationRepository
  ) {}

  async checkoutSubscription(userId: string, plan: string): Promise<CheckoutResult> {
    const normalizedPlan = plan.toUpperCase();
    const amount = PLAN_PRICES[normalizedPlan];

    if (!amount) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        `Paket langganan "${plan}" tidak valid. Pilihan yang tersedia: PRO.`,
        400
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppDomainError(META_CODES.ACCOUNT_NOT_FOUND, 'Pengguna tidak ditemukan.', 404);
    }

    const orderNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await this.paymentGateway.createTransaction({
      orderNumber,
      amount,
      customer: {
        fullName: user.fullName,
        email: user.email,
      },
    });

    await this.orderRepo.create({
      orderNumber,
      userId,
      amount,
      status: 'PENDING',
      paymentType: null,
      snapToken: transaction.token,
      metadata: { plan: normalizedPlan },
    });

    return {
      orderNumber,
      snapToken: transaction.token,
      redirectUrl: transaction.redirectUrl,
    };
  }

  async handleWebhook(rawPayload: Record<string, unknown>): Promise<boolean> {
    const isValid = this.paymentGateway.verifyWebhookSignature(rawPayload);
    if (!isValid) {
      throw new AppDomainError(
        META_CODES.UNAUTHORIZED,
        'Signature webhook pembayaran tidak valid.',
        401
      );
    }

    const orderNumber = String(rawPayload.order_id ?? '');
    const transactionStatus = String(rawPayload.transaction_status ?? '');
    const fraudStatus = String(rawPayload.fraud_status ?? '');
    const paymentType = String(rawPayload.payment_type ?? '');

    let mappedStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      mappedStatus = fraudStatus === 'challenge' ? 'CHALLENGE' : 'SETTLEMENT';
    } else if (transactionStatus === 'settlement') {
      mappedStatus = 'SETTLEMENT';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      mappedStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      mappedStatus = 'PENDING';
    }

    await this.orderRepo.updateStatus(orderNumber, mappedStatus, paymentType);
    return true;
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const orders = await this.orderRepo.findByUserId(userId);
    const activeOrder = orders.find((o) => o.status === 'SETTLEMENT');

    if (!activeOrder) {
      return {
        plan: 'FREE',
        status: 'ACTIVE',
        isSubscriberActive: false,
        expiresAt: null,
        latestOrder: null,
      };
    }

    const plan = (activeOrder.metadata?.plan as string) || 'PRO';

    let expiresAt: Date | null = null;
    if (this.invitationRepo) {
      const published = await this.invitationRepo.findPublishedByUserId(userId);
      const userInvitations = published ? [published] : await this.invitationRepo.findByUserId(userId);
      const targetInvitation = published ?? userInvitations[0];

      if (targetInvitation && targetInvitation.content) {
        const events =
          (targetInvitation.content.events as Array<{ id?: string; eventName?: string; date?: string }>) || [];
        const resepsiEvent =
          events.find(
            (e) =>
              e.id === 'event-resepsi' ||
              (typeof e.eventName === 'string' && e.eventName.toLowerCase().includes('resepsi'))
          ) ?? events[events.length - 1];

        if (resepsiEvent?.date && resepsiEvent.date.trim() !== '') {
          const parsedDate = new Date(resepsiEvent.date);
          if (!isNaN(parsedDate.getTime())) {
            // 30 hari (1 bulan) setelah tanggal resepsi
            expiresAt = new Date(parsedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
          }
        }
      }
    }

    const isSubscriberActive = expiresAt ? new Date() <= expiresAt : true;

    return {
      plan,
      status: isSubscriberActive ? 'ACTIVE' : 'EXPIRED',
      isSubscriberActive,
      expiresAt,
      latestOrder: {
        orderNumber: activeOrder.orderNumber,
        amount: activeOrder.amount,
        paymentType: activeOrder.paymentType,
        createdAt: activeOrder.createdAt,
        updatedAt: activeOrder.updatedAt,
      },
    };
  }
}
