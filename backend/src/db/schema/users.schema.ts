import { pgTable, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const userRoleEnum = ['USER', 'CONTRIBUTOR', 'ADMIN'] as const;
export type UserRole = (typeof userRoleEnum)[number];

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 32 }).$type<UserRole>().default('USER').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

