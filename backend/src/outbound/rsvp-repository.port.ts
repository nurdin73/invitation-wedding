import type { NewRsvp, Rsvp } from '../db/schema/rsvps.schema';

export interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
}

export interface IRsvpRepository {
  create(data: NewRsvp): Promise<Rsvp>;
  findByInvitationId(invitationId: string): Promise<Rsvp[]>;
  getStatsByInvitationId(invitationId: string): Promise<RsvpStats>;
}
