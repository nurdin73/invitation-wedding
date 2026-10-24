import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { rsvps, type NewRsvp, type Rsvp } from '../../db/schema/rsvps.schema';
import type { IRsvpRepository, RsvpStats } from '../rsvp-repository.port';

export class DrizzleRsvpRepository implements IRsvpRepository {
  async create(data: NewRsvp): Promise<Rsvp> {
    const [created] = await db.insert(rsvps).values(data).returning();
    return created;
  }

  async findByInvitationId(invitationId: string): Promise<Rsvp[]> {
    return await db
      .select()
      .from(rsvps)
      .where(eq(rsvps.invitationId, invitationId))
      .orderBy(desc(rsvps.createdAt));
  }

  async getStatsByInvitationId(invitationId: string): Promise<RsvpStats> {
    const list = await db
      .select({ attendanceStatus: rsvps.attendanceStatus })
      .from(rsvps)
      .where(eq(rsvps.invitationId, invitationId));

    let attending = 0;
    let notAttending = 0;

    for (const item of list) {
      const status = item.attendanceStatus.toLowerCase();
      if (status === 'attending' || status === 'hadir') {
        attending++;
      } else {
        notAttending++;
      }
    }

    return {
      total: list.length,
      attending,
      notAttending,
    };
  }
}
