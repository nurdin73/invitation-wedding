import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { InvitationController } from '../controllers/invitation.controller';
import { authMacro } from '../middlewares/auth.macro';

const controller = new InvitationController(registry.invitationService);

export const invitationRoutes = new Elysia({ prefix: '/invitations' })
  .use(authMacro)
  // Public route: ambil undangan publik via slug (tanpa auth)
  .get(
    '/public/:slug',
    async ({ params }) => {
      return await controller.getBySlug(params.slug);
    },
    {
      params: t.Object({ slug: t.String() }),
      detail: {
        tags: ['Invitations Public'],
        summary: 'Mengambil data undangan publik berdasarkan slug',
      },
    }
  )
  // Private routes: CRUD dashboard & editor
  .get(
    '/',
    async ({ user }) => {
      return await controller.getUserInvitations(user.id);
    },
    {
      isAuth: true,
      detail: {
        tags: ['Invitations'],
        summary: 'Mengambil seluruh undangan milik pengguna yang sedang login',
      },
    }
  )
  .get(
    '/:id',
    async ({ user, params }) => {
      return await controller.getById(user.id, params.id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ['Invitations'],
        summary: 'Mengambil detail satu undangan berdasarkan ID',
      },
    }
  )
  .post(
    '/',
    async ({ user, body }) => {
      return await controller.create({
        userId: user.id,
        title: body.title,
        slug: body.slug,
        templateId: body.templateId,
        groomNickname: body.groomNickname,
        brideNickname: body.brideNickname,
      });
    },
    {
      isAuth: true,
      body: t.Object({
        title: t.String({ minLength: 3 }),
        slug: t.String({ minLength: 3 }),
        templateId: t.Optional(t.String()),
        groomNickname: t.Optional(t.String()),
        brideNickname: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Invitations'],
        summary: 'Membuat draft undangan pernikahan baru',
      },
    }
  )
  .put(
    '/:id/draft',
    async ({ user, params, body }) => {
      return await controller.saveDraft({
        userId: user.id,
        invitationId: params.id,
        themeConfig: body.themeConfig,
        content: body.content,
        sections: body.sections,
      });
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        themeConfig: t.Optional(t.Record(t.String(), t.Unknown())),
        content: t.Optional(t.Record(t.String(), t.Unknown())),
        sections: t.Optional(t.Array(t.Unknown())),
      }),
      detail: {
        tags: ['Invitations'],
        summary: 'Menyimpan konfigurasi tema, konten, dan daftar section kanvas editor',
      },
    }
  )
  .post(
    '/:id/apply-template',
    async ({ user, params, body }) => {
      return await controller.applyTemplate(user.id, params.id, body.templateId);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        templateId: t.String(),
      }),
      detail: {
        tags: ['Invitations'],
        summary: 'Menerapkan template desain ke undangan tanpa menghapus konten',
      },
    }
  )
  .post(
    '/:id/publish',
    async ({ user, params }) => {
      return await controller.publish(user.id, params.id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ['Invitations'],
        summary: 'Mempublikasikan undangan ke publik',
      },
    }
  )
  .post(
    '/:id/unpublish',
    async ({ user, params }) => {
      return await controller.unpublish(user.id, params.id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ['Invitations'],
        summary: 'Menonaktifkan status publikasi undangan',
      },
    }
  )
  .delete(
    '/:id',
    async ({ user, params }) => {
      return await controller.delete(user.id, params.id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ['Invitations'],
        summary: 'Menghapus undangan pernikahan',
      },
    }
  );
