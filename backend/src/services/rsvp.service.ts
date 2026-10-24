import type { Rsvp } from '../db/schema/rsvps.schema';
import type { RsvpStats } from '../outbound/rsvp-repository.port';

export interface SubmitRsvpDTO {
  guestName: string;
  attendanceStatus: 'attending' | 'not_attending';
  guestCount?: number;
  message?: string;
}

export interface RsvpListResult {
  stats: RsvpStats;
  rsvps: Rsvp[];
}

export interface IRsvpService {
  submitRsvp(invitationId: string, payload: SubmitRsvpDTO): Promise<Rsvp>;
  getRsvps(invitationId: string): Promise<RsvpListResult>;
}
