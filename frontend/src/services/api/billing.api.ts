import { apiClient, type ApiResponse } from '@/lib/axios';

export interface CheckoutSession {
  orderNumber: string;
  snapToken: string;
  redirectUrl: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  isSubscriberActive: boolean;
  expiresAt: string | null;
}

export const billingApi = {
  async checkout(plan: 'PRO' | 'PLATINUM') {
    const res = await apiClient.post<ApiResponse<CheckoutSession>>('/billing/checkout', { plan });
    return res.data;
  },

  async getSubscription() {
    const res = await apiClient.get<ApiResponse<SubscriptionInfo>>('/billing/status');
    return res.data;
  },
};
