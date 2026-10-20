export interface CreateTransactionPayload {
  orderNumber: string;
  amount: number;
  customer: {
    fullName: string;
    email: string;
  };
}

export interface TransactionResult {
  token: string;
  redirectUrl: string;
}

export interface IPaymentGatewayPort {
  createTransaction(payload: CreateTransactionPayload): Promise<TransactionResult>;
  verifyWebhookSignature(rawPayload: Record<string, unknown>): boolean;
}
