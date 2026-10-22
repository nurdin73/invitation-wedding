import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '../../db';
import { authTokens, type AuthTokenType } from '../../db/schema/auth_tokens.schema';
import type { AuthTokenRecord, IAuthTokenRepository } from '../auth-token-repository.port';

export class DrizzleAuthTokenRepository implements IAuthTokenRepository {
  async createToken(data: {
    userId: string;
    tokenHash: string;
    type: AuthTokenType;
    expiresAt: Date;
  }): Promise<AuthTokenRecord> {
    const [created] = await db
      .insert(authTokens)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        type: data.type,
        expiresAt: data.expiresAt,
      })
      .returning();

    return this.mapToRecord(created);
  }

  async findValidToken(tokenHash: string, type: AuthTokenType): Promise<AuthTokenRecord | null> {
    const now = new Date();
    const result = await db
      .select()
      .from(authTokens)
      .where(
        and(
          eq(authTokens.tokenHash, tokenHash),
          eq(authTokens.type, type),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, now)
        )
      )
      .limit(1);

    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async markAsUsed(id: string): Promise<void> {
    await db
      .update(authTokens)
      .set({ usedAt: new Date() })
      .where(eq(authTokens.id, id));
  }

  async invalidateExistingTokens(userId: string, type: AuthTokenType): Promise<void> {
    await db
      .update(authTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(authTokens.userId, userId),
          eq(authTokens.type, type),
          isNull(authTokens.usedAt)
        )
      );
  }

  private mapToRecord(row: typeof authTokens.$inferSelect): AuthTokenRecord {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      type: row.type,
      expiresAt: row.expiresAt,
      usedAt: row.usedAt,
      createdAt: row.createdAt,
    };
  }
}
