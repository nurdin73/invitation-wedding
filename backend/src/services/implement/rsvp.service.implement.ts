import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IInvitationRepository } from '../../outbound/invitation-repository.port';
import type { IRsvpRepository } from '../../outbound/rsvp-repository.port';
import type { IRsvpService, RsvpListResult, SubmitRsvpDTO } from '../rsvp.service';
import type { Rsvp } from '../../db/schema/rsvps.schema';

export class RsvpServiceImplement implements IRsvpService {
  constructor(
    private readonly rsvpRepo: IRsvpRepository,
    private readonly invitationRepo: IInvitationRepository
  ) {}

  async submitRsvp(invitationId: string, payload: SubmitRsvpDTO): Promise<Rsvp> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Undangan pernikahan tidak ditemukan.',
        404
      );
    }

    const trimmedName = (payload.guestName || '').trim();
    if (!trimmedName) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        'Nama tamu wajib diisi.',
        400
      );
    }

    const attendanceStatus =
      payload.attendanceStatus === 'attending' ? 'attending' : 'not_attending';

    const guestCount = Math.max(1, Math.min(10, payload.guestCount || 1));
    const trimmedMessage = (payload.message || '').trim() || null;

    return await this.rsvpRepo.create({
      invitationId,
      guestName: trimmedName,
      attendanceStatus,
      guestCount,
      message: trimmedMessage,
    });
  }

  async getRsvps(invitationId: string): Promise<RsvpListResult> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Undangan pernikahan tidak ditemukan.',
        404
      );
    }

    const [rsvps, stats] = await Promise.all([
      this.rsvpRepo.findByInvitationId(invitationId),
      this.rsvpRepo.getStatsByInvitationId(invitationId),
    ]);

    return {
      stats,
      rsvps,
    };
  }
}
