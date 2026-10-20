import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { AuthController } from '../controllers/auth.controller';
import { authMacro } from '../middlewares/auth.macro';

const controller = new AuthController(registry.authService);

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(authMacro)
  .post(
    '/register',
    async ({ body, jwt }) => {
      const result = await controller.register(body);
      if (result.data) {
        // Sign real JWT token
        const token = await jwt.sign({
          id: result.data.user.id,
          email: result.data.user.email,
        });
        result.data.token = token;
      }
      return result;
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        fullName: t.String({ minLength: 2 }),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Pendaftaran pengguna baru',
      },
    }
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const result = await controller.login(body);
      if (result.data) {
        const token = await jwt.sign({
          id: result.data.user.id,
          email: result.data.user.email,
        });
        result.data.token = token;
      }
      return result;
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Masuk dengan kredensial email dan password',
      },
    }
  )
  .get(
    '/me',
    async ({ user }) => {
      return await controller.getProfile(user.id);
    },
    {
      isAuth: true,
      detail: {
        tags: ['Authentication'],
        summary: 'Mengambil data profil pengguna saat ini',
      },
    }
  );
