import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { MediaController } from '../controllers/media.controller';
import { authMacro } from '../middlewares/auth.macro';

const controller = new MediaController(registry.mediaService);

export const mediaRoutes = new Elysia({ prefix: '/media' })
  .use(authMacro)
  // Request presigned upload URL (protected)
  .post(
    '/presigned-url',
    async ({ user, body }) => {
      return await controller.requestPresignedUrl(user.id, body);
    },
    {
      isAuth: true,
      body: t.Object({
        filename: t.String({ minLength: 1 }),
        mimeType: t.String(),
        fileSize: t.Number({ minimum: 1 }),
      }),
      detail: {
        tags: ['Media'],
        summary: 'Membuat presigned PUT URL untuk upload aset media ke S3 / Cloudflare R2 / MinIO',
      },
    }
  )
  // Hapus aset media (protected)
  .delete(
    '/',
    async ({ user, query }) => {
      return await controller.deleteMedia(user.id, query.key);
    },
    {
      isAuth: true,
      query: t.Object({
        key: t.String(),
      }),
      detail: {
        tags: ['Media'],
        summary: 'Menghapus aset media dari object storage',
      },
    }
  );
