import { pgTable, text, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('PENDING'),
  paymentType: varchar('payment_type', { length: 50 }),
  snapToken: text('snap_token'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
