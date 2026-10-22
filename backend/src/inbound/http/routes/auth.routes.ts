import { Elysia, t } from 'elysia';
import { registry } from '../../../configs/registry';
import { AuthController } from '../controllers/auth.controller';
import { authMacro } from '../middlewares/auth.macro';

const controller = new AuthController(registry.authService);

// Kombinasi wajib: minimal 8 karakter, 1 huruf kecil, 1 huruf besar, 1 angka, 1 karakter khusus
const PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(authMacro)
  .post(
    '/register',
    async ({ body, jwt }) => {
      const result = await controller.register(body);
      if (result.data) {
        // Sign real JWT token including user role
        const token = await jwt.sign({
          id: result.data.user.id,
          email: result.data.user.email,
          role: result.data.user.role,
        });
        result.data.token = token;
      }
      return result;
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({
          minLength: 8,
          pattern: PASSWORD_REGEX,
          error: 'Kata sandi harus minimal 8 karakter dan mengandung kombinasi huruf besar, huruf kecil, angka, serta karakter khusus.',
        }),
        fullName: t.String({ minLength: 2 }),
        role: t.Optional(t.Union([t.Literal('USER'), t.Literal('CONTRIBUTOR')])),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Pendaftaran pengguna baru (User / Contributor)',
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
          role: result.data.user.role,
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
  .post(
    '/logout',
    async ({ user }) => {
      return await controller.logout(user.id);
    },
    {
      isAuth: true,
      detail: {
        tags: ['Authentication'],
        summary: 'Mengakhiri sesi autentikasi',
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
  )
  .post(
    '/forgot-password',
    async ({ body }) => {
      return await controller.forgotPassword(body);
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Permintaan tautan atur ulang kata sandi',
      },
    }
  )
  .post(
    '/reset-password',
    async ({ body }) => {
      return await controller.resetPassword(body);
    },
    {
      body: t.Object({
        token: t.String({ minLength: 10 }),
        newPassword: t.String({
          minLength: 8,
          pattern: PASSWORD_REGEX,
          error: 'Kata sandi baru harus minimal 8 karakter dan mengandung kombinasi huruf besar, huruf kecil, angka, serta karakter khusus.',
        }),
      }),

      detail: {
        tags: ['Authentication'],
        summary: 'Menyimpan kata sandi baru menggunakan token reset',
      },
    }
  )
  .post(
    '/verify-email/send',
    async ({ user }) => {
      return await controller.sendEmailVerification(user.id);
    },
    {
      isAuth: true,
      detail: {
        tags: ['Authentication'],
        summary: 'Kirim ulang email verifikasi akun',
      },
    }
  )
  .post(
    '/verify-email/confirm',
    async ({ body }) => {
      return await controller.verifyEmail(body);
    },
    {
      body: t.Object({
        token: t.String({ minLength: 10 }),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Konfirmasi verifikasi email menggunakan token',
      },
    }
  );
