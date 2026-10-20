import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IInvitationRepository, InvitationRecord } from '../../outbound/invitation-repository.port';
import type { IBillingService } from '../billing.service';
import type { CreateInvitationDTO, IInvitationService, SaveDraftDTO } from '../invitation.service';

export class InvitationServiceImplement implements IInvitationService {
  constructor(
    private readonly invitationRepo: IInvitationRepository,
    private readonly billingService: IBillingService
  ) {}

  async getInvitationById(id: string, userId: string): Promise<InvitationRecord> {
    const invitation = await this.invitationRepo.findById(id);
    if (!invitation) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Undangan pernikahan tidak ditemukan.',
        404
      );
    }

    if (invitation.userId !== userId) {
      throw new AppDomainError(
        META_CODES.FORBIDDEN_RESOURCE,
        'Anda tidak memiliki akses ke undangan ini.',
        403
      );
    }

    return invitation;
  }

  async getPublicInvitationBySlug(slug: string): Promise<InvitationRecord> {
    const invitation = await this.invitationRepo.findBySlug(slug);
    if (!invitation || !invitation.isPublished) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Undangan tidak ditemukan atau belum dipublikasikan.',
        404
      );
    }

    return invitation;
  }

  async getUserInvitations(userId: string): Promise<InvitationRecord[]> {
    return await this.invitationRepo.findByUserId(userId);
  }

  async createInvitation(payload: CreateInvitationDTO): Promise<InvitationRecord> {
    const cleanSlug = payload.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const existingSlug = await this.invitationRepo.findBySlug(cleanSlug);
    if (existingSlug) {
      throw new AppDomainError(
        META_CODES.SLUG_ALREADY_EXISTS,
        'Tautan (slug) undangan sudah digunakan oleh pasangan lain. Silakan pilih tautan unik lainnya.',
        409
      );
    }

    // Default visual theme & sections
    const defaultThemeConfig = {
      palette: 'champagne',
      primaryColor: '#B45309',
      headingFont: 'Playfair Display',
      bodyFont: 'Plus Jakarta Sans',
      canvasBackground: '#FFFBEB',
    };

    const defaultSections = [
      { id: 'sec-hero-1', type: 'hero', variant: 'classic', isVisible: true, data: { title: payload.title } },
      { id: 'sec-couple-1', type: 'couple', variant: 'side-by-side', isVisible: true, data: {} },
      { id: 'sec-event-1', type: 'event', variant: 'timeline', isVisible: true, data: {} },
    ];

    return await this.invitationRepo.create({
      userId: payload.userId,
      slug: cleanSlug,
      title: payload.title,
      themeConfig: defaultThemeConfig,
      sections: defaultSections,
      isPublished: false,
    });
  }

  async saveDraft(payload: SaveDraftDTO): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(payload.invitationId, payload.userId);

    return await this.invitationRepo.updatePayload(
      invitation.id,
      payload.themeConfig,
      payload.sections
    );
  }

  async publish(userId: string, invitationId: string): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(invitationId, userId);

    // Verifikasi kuota / paket langganan aktif via BillingService
    const subscription = await this.billingService.getSubscriptionStatus(userId);
    if (!subscription.isSubscriberActive && subscription.plan === 'FREE') {
      const existingUserInvitations = await this.invitationRepo.findByUserId(userId);
      const publishedCount = existingUserInvitations.filter((inv) => inv.isPublished && inv.id !== invitationId).length;
      if (publishedCount >= 1) {
        throw new AppDomainError(
          META_CODES.INVITATION_QUOTA_EXCEEDED,
          'Kuota paket gratis telah tercapai (maksimal 1 undangan publik). Tingkatkan paket Anda untuk mempublikasikan lebih banyak undangan.',
          403
        );
      }
    }

    return await this.invitationRepo.setPublishStatus(invitation.id, true);
  }

  async unpublish(userId: string, invitationId: string): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(invitationId, userId);
    return await this.invitationRepo.setPublishStatus(invitation.id, false);
  }

  async deleteInvitation(userId: string, invitationId: string): Promise<boolean> {
    await this.getInvitationById(invitationId, userId);
    return await this.invitationRepo.delete(invitationId);
  }
}
