import type { InvitationRecord } from '../outbound/invitation-repository.port';

export interface SaveDraftDTO {
  userId: string;
  invitationId: string;
  themeConfig: Record<string, unknown>;
  sections: unknown[];
}

export interface CreateInvitationDTO {
  userId: string;
  title: string;
  slug: string;
}

export interface IInvitationService {
  getInvitationById(id: string, userId: string): Promise<InvitationRecord>;
  getPublicInvitationBySlug(slug: string): Promise<InvitationRecord>;
  getUserInvitations(userId: string): Promise<InvitationRecord[]>;
  createInvitation(payload: CreateInvitationDTO): Promise<InvitationRecord>;
  saveDraft(payload: SaveDraftDTO): Promise<InvitationRecord>;
  publish(userId: string, invitationId: string): Promise<InvitationRecord>;
  unpublish(userId: string, invitationId: string): Promise<InvitationRecord>;
  deleteInvitation(userId: string, invitationId: string): Promise<boolean>;
}
