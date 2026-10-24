import { DrizzleUserRepository } from '../outbound/repository/drizzle-user.repository';
import { DrizzleAuthTokenRepository } from '../outbound/repository/drizzle-auth-token.repository';
import { DrizzleInvitationRepository } from '../outbound/repository/drizzle-invitation.repository';
import { DrizzleTemplateRepository } from '../outbound/repository/drizzle-template.repository';
import { DrizzleOrderRepository } from '../outbound/repository/drizzle-order.repository';
import { DrizzleRsvpRepository } from '../outbound/repository/drizzle-rsvp.repository';
import { S3StorageAdapter } from '../outbound/storage/s3-storage.adapter';
import { MidtransPaymentAdapter } from '../outbound/payment/midtrans-payment.adapter';
import { NodemailerSmtpAdapter } from '../outbound/smtp/nodemailer-smtp.adapter';

import type { IUserRepository } from '../outbound/user-repository.port';
import type { IAuthTokenRepository } from '../outbound/auth-token-repository.port';
import type { IInvitationRepository } from '../outbound/invitation-repository.port';
import type { ITemplateRepository } from '../outbound/template-repository.port';
import type { IOrderRepository } from '../outbound/order-repository.port';
import type { IRsvpRepository } from '../outbound/rsvp-repository.port';
import type { IStoragePort } from '../outbound/storage.port';
import type { IPaymentGatewayPort } from '../outbound/payment-gateway.port';
import type { ISmtpPort } from '../outbound/smtp.port';

import { AuthServiceImplement } from '../services/implement/auth.service.implement';
import { InvitationServiceImplement } from '../services/implement/invitation.service.implement';
import { TemplateServiceImplement } from '../services/implement/template.service.implement';
import { BillingServiceImplement } from '../services/implement/billing.service.implement';
import { MediaServiceImplement } from '../services/implement/media.service.implement';
import { RsvpServiceImplement } from '../services/implement/rsvp.service.implement';

import type { IAuthService } from '../services/auth.service';
import type { IInvitationService } from '../services/invitation.service';
import type { ITemplateService } from '../services/template.service';
import type { IBillingService } from '../services/billing.service';
import type { IMediaService } from '../services/media.service';
import type { IRsvpService } from '../services/rsvp.service';

export class Registry {
  // Outbound Driven Adapters
  public readonly userRepository: IUserRepository;
  public readonly authTokenRepository: IAuthTokenRepository;
  public readonly invitationRepository: IInvitationRepository;
  public readonly templateRepository: ITemplateRepository;
  public readonly orderRepository: IOrderRepository;
  public readonly rsvpRepository: IRsvpRepository;
  public readonly storagePort: IStoragePort;
  public readonly paymentGateway: IPaymentGatewayPort;
  public readonly smtpPort: ISmtpPort;

  // Inbound Services
  public readonly authService: IAuthService;
  public readonly billingService: IBillingService;
  public readonly invitationService: IInvitationService;
  public readonly templateService: ITemplateService;
  public readonly mediaService: IMediaService;
  public readonly rsvpService: IRsvpService;

  constructor() {
    // 1. Inisialisasi Outbound Adapters
    this.userRepository = new DrizzleUserRepository();
    this.authTokenRepository = new DrizzleAuthTokenRepository();
    this.invitationRepository = new DrizzleInvitationRepository();
    this.templateRepository = new DrizzleTemplateRepository();
    this.orderRepository = new DrizzleOrderRepository();
    this.rsvpRepository = new DrizzleRsvpRepository();
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
      this.authTokenRepository,
      this.smtpPort
    );

    this.templateService = new TemplateServiceImplement(
      this.templateRepository
    );

    this.invitationService = new InvitationServiceImplement(
      this.invitationRepository,
      this.billingService,
      this.templateRepository
    );

    this.mediaService = new MediaServiceImplement(this.storagePort);

    this.rsvpService = new RsvpServiceImplement(
      this.rsvpRepository,
      this.invitationRepository
    );
  }
}

export const registry = new Registry();

