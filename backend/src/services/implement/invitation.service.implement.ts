import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IInvitationRepository, InvitationRecord } from '../../outbound/invitation-repository.port';
import type { ITemplateRepository } from '../../outbound/template-repository.port';
import type { IBillingService } from '../billing.service';
import type {
  CreateInvitationDTO,
  IInvitationService,
  SaveDraftDTO,
  ApplyTemplateDTO,
} from '../invitation.service';
import {
  createDefaultInvitationContent,
  mergeTemplateLayout,
} from './helpers/invitation-content.helper';

export class InvitationServiceImplement implements IInvitationService {
  constructor(
    private readonly invitationRepo: IInvitationRepository,
    private readonly billingService: IBillingService,
    private readonly templateRepo: ITemplateRepository
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
    const existingCount = await this.invitationRepo.countByUserId(payload.userId);
    if (existingCount >= 10) {
      throw new AppDomainError(
        META_CODES.INVITATION_QUOTA_EXCEEDED,
        'Batas maksimal 10 draf undangan telah tercapai untuk akun Anda.',
        400
      );
    }

    const cleanSlug = payload.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const existingSlug = await this.invitationRepo.findBySlug(cleanSlug);
    if (existingSlug) {
      throw new AppDomainError(
        META_CODES.SLUG_ALREADY_EXISTS,
        'Tautan (slug) undangan sudah digunakan oleh pasangan lain. Silakan pilih tautan unik lainnya.',
        409
      );
    }

    // Default canonical content
    const content = createDefaultInvitationContent(
      payload.title,
      payload.groomNickname || '',
      payload.brideNickname || ''
    ) as unknown as Record<string, unknown>;

    // Default visual theme & sections layout
    let themeConfig: Record<string, unknown> = {
      paletteId: 'dusty-rose',
      primaryColor: '#B86B70',
      secondaryColor: '#DFB15B',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      canvasBackground: '#FAF8F5',
    };

    let sections: unknown[] = [
      { id: 'sec-hero-1', type: 'hero', variant: 'classic', isVisible: true, copy: { subtitle: 'The Wedding Celebration' } },
      { id: 'sec-quote-1', type: 'quote', variant: 'sacred', isVisible: true, copy: { title: 'Kutipan Suci' } },
      { id: 'sec-couple-1', type: 'couple', variant: 'side-by-side', isVisible: true, copy: { title: 'Mempelai Pengantin' } },
      { id: 'sec-event-1', type: 'event', variant: 'cards', isVisible: true, copy: { title: 'Agenda Acara' } },
      { id: 'sec-gallery-1', type: 'gallery', variant: 'grid', isVisible: true, copy: { title: 'Momen Bahagia' } },
      { id: 'sec-rsvp-1', type: 'rsvp', variant: 'interactive', isVisible: true, copy: { title: 'Konfirmasi Kehadiran' } },
      { id: 'sec-gift-1', type: 'gift', variant: 'bank-cards', isVisible: true, copy: { title: 'Tanda Kasih' } },
      { id: 'sec-footer-1', type: 'footer', variant: 'closing', isVisible: true, copy: { closingText: 'Terima Kasih' } },
    ];

    // Jika templateId diberikan, ambil konfigurasi layout dari template
    if (payload.templateId) {
      const template = await this.templateRepo.findById(payload.templateId);
      if (template) {
        themeConfig = { ...template.themeConfig };
        sections = mergeTemplateLayout([], template.sections);
      }
    }

    return await this.invitationRepo.create({
      userId: payload.userId,
      slug: cleanSlug,
      title: payload.title,
      themeConfig,
      content,
      sections,
      isPublished: false,
    });
  }

  async saveDraft(payload: SaveDraftDTO): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(payload.invitationId, payload.userId);

    return await this.invitationRepo.updatePayload(invitation.id, {
      themeConfig: payload.themeConfig,
      content: payload.content,
      sections: payload.sections,
    });
  }

  async applyTemplate(payload: ApplyTemplateDTO): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(payload.invitationId, payload.userId);

    const template = await this.templateRepo.findById(payload.templateId);
    if (!template) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Template desain yang dipilih tidak ditemukan.',
        404
      );
    }

    // Merge layout baru dengan copy yang ada, konten mempelai tetap 100% aman
    const mergedSections = mergeTemplateLayout(invitation.sections, template.sections);

    return await this.invitationRepo.updatePayload(invitation.id, {
      themeConfig: { ...template.themeConfig },
      sections: mergedSections,
    });
  }

  async publish(userId: string, invitationId: string): Promise<InvitationRecord> {
    const invitation = await this.getInvitationById(invitationId, userId);

    // Validasi kelayakan publikasi: pastikan setidaknya nama panggilan mempelai terisi
    const content = (invitation.content || {}) as Record<string, unknown>;
    const couple = (content.couple || {}) as Record<string, Record<string, string>>;
    const groom = couple.groom || {};
    const bride = couple.bride || {};

    if (!groom.nickname && !groom.fullName) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        'Mohon lengkapi nama mempelai pria di tab Isi Data sebelum mempublikasikan undangan.',
        422
      );
    }

    if (!bride.nickname && !bride.fullName) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        'Mohon lengkapi nama mempelai wanita di tab Isi Data sebelum mempublikasikan undangan.',
        422
      );
    }

    // Hanya 1 undangan yang dipublikasikan per akun
    // Otomatis unpublish undangan lain yang sedang aktif
    const existingPublished = await this.invitationRepo.findPublishedByUserId(userId);
    if (existingPublished && existingPublished.id !== invitationId) {
      await this.invitationRepo.unpublishAllByUserId(userId);
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

