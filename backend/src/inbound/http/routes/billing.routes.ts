import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { BillingController } from '../controllers/billing.controller';
import { authMacro } from '../middlewares/auth.macro';

const controller = new BillingController(registry.billingService);

export const billingRoutes = new Elysia({ prefix: '/billing' })
  .use(authMacro)
  // Checkout langganan (protected)
  .post(
    '/checkout',
    async ({ user, body }) => {
      return await controller.checkout(user.id, body.plan);
    },
    {
      isAuth: true,
      body: t.Object({
        plan: t.String(),
      }),
      detail: {
        tags: ['Billing'],
        summary: 'Membuat sesi transaksi checkout pembayaran paket langganan',
      },
    }
  )
  // Status langganan pengguna saat ini (protected)
  .get(
    '/status',
    async ({ user }) => {
      return await controller.getSubscription(user.id);
    },
    {
      isAuth: true,
      detail: {
        tags: ['Billing'],
        summary: 'Mengambil status dan masa aktif paket langganan pengguna',
      },
    }
  )
  // Webhook notifikasi pembayaran Midtrans (public)
  .post(
    '/webhook',
    async ({ body }) => {
      return await controller.webhook(body as Record<string, unknown>);
    },
    {
      body: t.Record(t.String(), t.Unknown()),
      detail: {
        tags: ['Billing'],
        summary: 'Webhook endpoint notifikasi status transaksi Midtrans',
      },
    }
  );
