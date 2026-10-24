import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { invitationRoutes } from './invitation.routes';
import { billingRoutes } from './billing.routes';
import { mediaRoutes } from './media.routes';
import { templateRoutes } from './template.routes';

export const apiRoutes = new Elysia({ prefix: '/api/v1' })
  .use(authRoutes)
  .use(invitationRoutes)
  .use(billingRoutes)
  .use(mediaRoutes)
  .use(templateRoutes);
