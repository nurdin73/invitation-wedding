import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { TemplateController } from '../controllers/template.controller';

const controller = new TemplateController(registry.templateService);

export const templateRoutes = new Elysia({ prefix: '/templates' })
  .get(
    '/',
    async () => {
      return await controller.getAllActive();
    },
    {
      detail: {
        tags: ['Templates'],
        summary: 'Mengambil seluruh template desain undangan yang aktif',
      },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      return await controller.getById(params.id);
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ['Templates'],
        summary: 'Mengambil detail template desain berdasarkan ID',
      },
    }
  );
