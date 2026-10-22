import { pgTable, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const authTokenTypeEnum = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const;
export type AuthTokenType = (typeof authTokenTypeEnum)[number];

export const authTokens = pgTable(
  'auth_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: text('token_hash').notNull(),
    type: varchar('type', { length: 32 }).$type<AuthTokenType>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashIdx: index('idx_auth_tokens_hash').on(table.tokenHash),
    userIdTypeIdx: index('idx_auth_tokens_user_type').on(table.userId, table.type),
  })
);

export type AuthToken = typeof authTokens.$inferSelect;
export type NewAuthToken = typeof authTokens.$inferInsert;
