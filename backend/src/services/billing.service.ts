export interface CheckoutResult {
  orderNumber: string;
  snapToken: string;
  redirectUrl: string;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  isSubscriberActive: boolean;
  expiresAt: Date | null;
}

export interface IBillingService {
  checkoutSubscription(userId: string, plan: string): Promise<CheckoutResult>;
  handleWebhook(rawPayload: Record<string, unknown>): Promise<boolean>;
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;
}
