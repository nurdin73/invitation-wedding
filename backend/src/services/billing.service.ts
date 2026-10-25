export interface CheckoutResult {
  orderNumber: string;
  snapToken: string;
  redirectUrl: string;
}

export interface SubscriptionOrder {
  orderNumber: string;
  amount: number;
  paymentType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  isSubscriberActive: boolean;
  expiresAt: Date | null;
  latestOrder?: SubscriptionOrder | null;
}

export interface IBillingService {
  checkoutSubscription(userId: string, plan: string): Promise<CheckoutResult>;
  handleWebhook(rawPayload: Record<string, unknown>): Promise<boolean>;
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;
}
