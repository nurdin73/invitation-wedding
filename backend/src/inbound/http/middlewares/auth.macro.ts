import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '../../../configs/env';
import { AppDomainError } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { UserRole } from '../../../db/schema/users.schema';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authMacro = new Elysia({ name: 'auth-macro' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
      exp: '7d',
    })
  )
  .macro({
    isAuth: {
      async resolve({ jwt, headers }) {
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new AppDomainError(
            META_CODES.UNAUTHORIZED,
            'Sesi autentikasi tidak ditemukan. Silakan login terlebih dahulu.',
            401
          );
        }

        const token = authHeader.slice(7);
        const payload = (await jwt.verify(token)) as AuthUserPayload | false;

        if (!payload || !payload.id) {
          throw new AppDomainError(
            META_CODES.TOKEN_EXPIRED,
            'Token autentikasi tidak valid atau telah kedaluwarsa.',
            401
          );
        }

        return {
          user: {
            id: payload.id,
            email: payload.email,
            role: payload.role || 'USER',
          },
        };
      },
    },
    requireRole: (allowedRole: UserRole) => ({
      async resolve({ jwt, headers }) {
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new AppDomainError(
            META_CODES.UNAUTHORIZED,
            'Sesi autentikasi tidak ditemukan. Silakan login terlebih dahulu.',
            401
          );
        }

        const token = authHeader.slice(7);
        const payload = (await jwt.verify(token)) as AuthUserPayload | false;

        if (!payload || !payload.id) {
          throw new AppDomainError(
            META_CODES.TOKEN_EXPIRED,
            'Token autentikasi tidak valid atau telah kedaluwarsa.',
            401
          );
        }

        const userRole = payload.role || 'USER';
        if (userRole !== allowedRole && userRole !== 'ADMIN') {
          throw new AppDomainError(
            META_CODES.FORBIDDEN_RESOURCE,
            'Akses ditolak. Peran Anda tidak memiliki izin untuk fitur ini.',
            403
          );
        }

        return {
          user: {
            id: payload.id,
            email: payload.email,
            role: userRole,
          },
        };
      },
    }),
  });


