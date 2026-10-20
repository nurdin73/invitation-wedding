import { DrizzleUserRepository } from '../outbound/repository/drizzle-user.repository';
import { DrizzleInvitationRepository } from '../outbound/repository/drizzle-invitation.repository';
import { DrizzleOrderRepository } from '../outbound/repository/drizzle-order.repository';
import { S3StorageAdapter } from '../outbound/storage/s3-storage.adapter';
import { MidtransPaymentAdapter } from '../outbound/payment/midtrans-payment.adapter';
import { NodemailerSmtpAdapter } from '../outbound/smtp/nodemailer-smtp.adapter';

import type { IUserRepository } from '../outbound/user-repository.port';
import type { IInvitationRepository } from '../outbound/invitation-repository.port';
import type { IOrderRepository } from '../outbound/order-repository.port';
import type { IStoragePort } from '../outbound/storage.port';
import type { IPaymentGatewayPort } from '../outbound/payment-gateway.port';
import type { ISmtpPort } from '../outbound/smtp.port';

import { AuthServiceImplement } from '../services/implement/auth.service.implement';
import { InvitationServiceImplement } from '../services/implement/invitation.service.implement';
import { BillingServiceImplement } from '../services/implement/billing.service.implement';
import { MediaServiceImplement } from '../services/implement/media.service.implement';

import type { IAuthService } from '../services/auth.service';
import type { IInvitationService } from '../services/invitation.service';
import type { IBillingService } from '../services/billing.service';
import type { IMediaService } from '../services/media.service';

export class Registry {
  // Outbound Driven Adapters
  public readonly userRepository: IUserRepository;
  public readonly invitationRepository: IInvitationRepository;
  public readonly orderRepository: IOrderRepository;
  public readonly storagePort: IStoragePort;
  public readonly paymentGateway: IPaymentGatewayPort;
  public readonly smtpPort: ISmtpPort;

  // Inbound Services
  public readonly authService: IAuthService;
  public readonly billingService: IBillingService;
  public readonly invitationService: IInvitationService;
  public readonly mediaService: IMediaService;

  constructor() {
    // 1. Inisialisasi Outbound Adapters
    this.userRepository = new DrizzleUserRepository();
    this.invitationRepository = new DrizzleInvitationRepository();
    this.orderRepository = new DrizzleOrderRepository();
    this.storagePort = new S3StorageAdapter();
    this.paymentGateway = new MidtransPaymentAdapter();
    this.smtpPort = new NodemailerSmtpAdapter();

    // 2. Inisialisasi Services dengan Dependency Inversion
    this.billingService = new BillingServiceImplement(
      this.orderRepository,
      this.paymentGateway,
      this.userRepository
    );

    this.authService = new AuthServiceImplement(
      this.userRepository,
      this.smtpPort
    );

    this.invitationService = new InvitationServiceImplement(
      this.invitationRepository,
      this.billingService
    );

    this.mediaService = new MediaServiceImplement(this.storagePort);
  }
}

export const registry = new Registry();
