import type { AuthTokenType } from '../db/schema/auth_tokens.schema';

export interface AuthTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  type: AuthTokenType;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface IAuthTokenRepository {
  createToken(data: {
    userId: string;
    tokenHash: string;
    type: AuthTokenType;
    expiresAt: Date;
  }): Promise<AuthTokenRecord>;
  findValidToken(tokenHash: string, type: AuthTokenType): Promise<AuthTokenRecord | null>;
  markAsUsed(id: string): Promise<void>;
  invalidateExistingTokens(userId: string, type: AuthTokenType): Promise<void>;
}
