import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { IRsvpService, SubmitRsvpDTO } from '../../../services/rsvp.service';

export class RsvpController {
  constructor(private readonly rsvpService: IRsvpService) {}

  async submitRsvp(invitationId: string, payload: SubmitRsvpDTO) {
    const result = await this.rsvpService.submitRsvp(invitationId, payload);
    return ResponseHelper.success(
      result,
      'Konfirmasi kehadiran berhasil dikirim.',
      META_CODES.RESOURCE_CREATED
    );
  }

  async getRsvps(invitationId: string) {
    const result = await this.rsvpService.getRsvps(invitationId);
    return ResponseHelper.success(
      result,
      'Daftar ucapan dan kehadiran berhasil diambil.',
      META_CODES.SUCCESS_OK
    );
  }
}
