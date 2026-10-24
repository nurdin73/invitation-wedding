import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';

export const invitations = pgTable(
  'invitations',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    themeConfig: jsonb('theme_config').$type<Record<string, unknown>>().notNull().default({}),
    content: jsonb('content').$type<Record<string, unknown>>().notNull().default({}),
    sections: jsonb('sections').$type<unknown[]>().notNull().default([]),
    isPublished: boolean('is_published').notNull().default(false),
    version: integer('version').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('one_published_per_user_idx')
      .on(table.userId)
      .where(sql`is_published = true`),
  ]
);

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

