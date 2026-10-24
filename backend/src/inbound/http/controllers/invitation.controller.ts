import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { IInvitationService, SaveDraftDTO, CreateInvitationDTO } from '../../../services/invitation.service';

export class InvitationController {
  constructor(private readonly invitationService: IInvitationService) {}

  async getById(userId: string, id: string) {
    const result = await this.invitationService.getInvitationById(id, userId);
    return ResponseHelper.success(result, 'Data undangan berhasil diambil.', META_CODES.SUCCESS_OK);
  }

  async getBySlug(slug: string) {
    const result = await this.invitationService.getPublicInvitationBySlug(slug);
    return ResponseHelper.success(result, 'Undangan publik berhasil diambil.', META_CODES.SUCCESS_OK);
  }

  async getUserInvitations(userId: string) {
    const result = await this.invitationService.getUserInvitations(userId);
    return ResponseHelper.success(result, 'Daftar undangan berhasil diambil.', META_CODES.SUCCESS_OK);
  }

  async create(payload: CreateInvitationDTO) {
    const result = await this.invitationService.createInvitation(payload);
    return ResponseHelper.success(result, 'Undangan baru berhasil dibuat.', META_CODES.RESOURCE_CREATED);
  }

  async saveDraft(payload: SaveDraftDTO) {
    const result = await this.invitationService.saveDraft(payload);
    return ResponseHelper.success(result, 'Draft undangan berhasil disimpan.', META_CODES.DRAFT_SAVED);
  }

  async applyTemplate(userId: string, invitationId: string, templateId: string) {
    const result = await this.invitationService.applyTemplate({ userId, invitationId, templateId });
    return ResponseHelper.success(result, 'Template desain berhasil diterapkan.', META_CODES.SUCCESS_OK);
  }

  async publish(userId: string, invitationId: string) {
    const result = await this.invitationService.publish(userId, invitationId);
    return ResponseHelper.success(result, 'Undangan berhasil dipublikasikan.', META_CODES.INVITATION_PUBLISHED);
  }

  async unpublish(userId: string, invitationId: string) {
    const result = await this.invitationService.unpublish(userId, invitationId);
    return ResponseHelper.success(result, 'Status publikasi undangan dinonaktifkan.', META_CODES.SUCCESS_OK);
  }

  async delete(userId: string, invitationId: string) {
    const result = await this.invitationService.deleteInvitation(userId, invitationId);
    return ResponseHelper.success(result, 'Undangan berhasil dihapus.', META_CODES.SUCCESS_OK);
  }
}
