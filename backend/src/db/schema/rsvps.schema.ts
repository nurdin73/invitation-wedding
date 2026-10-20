import { pgTable, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { invitations } from './invitations.schema';

export const rsvps = pgTable('rsvps', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  invitationId: text('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),
  guestName: varchar('guest_name', { length: 255 }).notNull(),
  attendanceStatus: varchar('attendance_status', { length: 50 }).notNull(),
  guestCount: integer('guest_count').notNull().default(1),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;
