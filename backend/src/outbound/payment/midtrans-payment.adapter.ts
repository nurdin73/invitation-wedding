import crypto from 'node:crypto';
import { env } from '../../configs/env';
import type { CreateTransactionPayload, IPaymentGatewayPort, TransactionResult } from '../payment-gateway.port';

interface MidtransSnapClient {
  createTransaction(params: Record<string, unknown>): Promise<{ token: string; redirect_url: string }>;
}

export class MidtransPaymentAdapter implements IPaymentGatewayPort {
  private snapClient: MidtransSnapClient | null = null;

  constructor() {
    this.initClient();
  }

  private async initClient(): Promise<void> {
    try {
      // Dynamic import to handle midtrans-client CJS/ESM compatibility safely
      const midtrans = await import('midtrans-client');
      const Snap = (midtrans.default?.Snap || midtrans.Snap) as new (options: {
        isProduction: boolean;
        serverKey: string;
        clientKey: string;
      }) => MidtransSnapClient;

      if (Snap) {
        this.snapClient = new Snap({
          isProduction: env.MIDTRANS_IS_PRODUCTION,
          serverKey: env.MIDTRANS_SERVER_KEY,
          clientKey: env.MIDTRANS_CLIENT_KEY,
        });
      }
    } catch (err) {
      console.warn('Inisialisasi Midtrans Snap client dilewati:', err);
    }
  }

  async createTransaction(payload: CreateTransactionPayload): Promise<TransactionResult> {
    if (!this.snapClient) {
      await this.initClient();
    }

    if (!this.snapClient) {
      // Fallback untuk environment testing lokal tanpa Midtrans credentials aktif
      return {
        token: `mock_token_${payload.orderNumber}`,
        redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_${payload.orderNumber}`,
      };
    }

    const parameter = {
      transaction_details: {
        order_id: payload.orderNumber,
        gross_amount: payload.amount,
      },
      customer_details: {
        first_name: payload.customer.fullName,
        email: payload.customer.email,
      },
    };

    const response = await this.snapClient.createTransaction(parameter);
    return {
      token: response.token,
      redirectUrl: response.redirect_url,
    };
  }

  verifyWebhookSignature(rawPayload: Record<string, unknown>): boolean {
    const orderId = String(rawPayload.order_id ?? '');
    const statusCode = String(rawPayload.status_code ?? '');
    const grossAmount = String(rawPayload.gross_amount ?? '');
    const serverKey = env.MIDTRANS_SERVER_KEY;
    const signatureKey = String(rawPayload.signature_key ?? '');

    if (!signatureKey) return false;

    const hash = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    return hash === signatureKey;
  }
}
