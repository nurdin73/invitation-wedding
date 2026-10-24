import { pgTable, text, varchar, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export const templates = pgTable('templates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  themeConfig: jsonb('theme_config').$type<Record<string, unknown>>().notNull().default({}),
  sampleContent: jsonb('sample_content').$type<Record<string, unknown>>().notNull().default({}),
  sections: jsonb('sections').$type<unknown[]>().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

