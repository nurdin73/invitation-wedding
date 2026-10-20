import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { IBillingService } from '../../../services/billing.service';

export class BillingController {
  constructor(private readonly billingService: IBillingService) {}

  async checkout(userId: string, plan: string) {
    const result = await this.billingService.checkoutSubscription(userId, plan);
    return ResponseHelper.success(
      result,
      'Transaksi checkout berhasil disiapkan.',
      META_CODES.SUCCESS_OK
    );
  }

  async webhook(payload: Record<string, unknown>) {
    const result = await this.billingService.handleWebhook(payload);
    return ResponseHelper.success(
      { processed: result },
      'Webhook berhasil diproses.',
      META_CODES.SUCCESS_OK
    );
  }

  async getSubscription(userId: string) {
    const result = await this.billingService.getSubscriptionStatus(userId);
    return ResponseHelper.success(
      result,
      'Status langganan berhasil diambil.',
      META_CODES.SUCCESS_OK
    );
  }
}
