import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { env } from './configs/env';
import { errorHandler } from './inbound/http/middlewares/error.handler';
import { apiRoutes } from './inbound/http/routes';

export const app = new Elysia()
  .use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:3000'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
  )
  .use(
    openapi({
      path: '/swagger',
      documentation: {
        info: {
          title: 'Wedding Invitation SaaS API Gateway',
          description: 'Dokumentasi RESTful API Platform SaaS Undangan Pernikahan Digital & Template Editor',
          version: '1.0.0',
        },
        tags: [
          { name: 'Authentication', description: 'Endpoint sesi dan otentikasi akun' },
          { name: 'Invitations', description: 'Pengelolaan draft dan publikasi undangan pernikahan' },
          { name: 'Invitations Public', description: 'Akses publik halaman tamu undangan' },
          { name: 'Billing', description: 'Checkout langganan dan webhook Midtrans' },
          { name: 'Media', description: 'Presigned upload Cloudflare R2 / MinIO lokal' },
        ],
      },
    })
  )
  .use(errorHandler)
  .get('/health', () => ({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'wedding-invitation-backend',
  }))
  .use(apiRoutes)
  .listen(env.PORT);

console.log(`🚀 Server backend ElysiaJS aktif di http://localhost:${env.PORT}`);
console.log(`📖 Dokumentasi Swagger aktif di http://localhost:${env.PORT}/swagger`);

// Export type App untuk dikonsumsi frontend Next.js via @elysiajs/eden
export type App = typeof app;
