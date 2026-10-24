import { apiClient, type ApiResponse } from '@/lib/axios';
import type { InvitationContent, ThemeConfig } from '@/modules/invitation-sections/types';

export interface InvitationData {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeConfig: ThemeConfig | Record<string, unknown>;
  content: InvitationContent;
  sections: unknown[];
  isPublished: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveDraftPayload {
  themeConfig?: Record<string, unknown>;
  content?: Record<string, unknown>;
  sections?: unknown[];
}

export interface CreateInvitationPayload {
  title: string;
  slug: string;
  templateId?: string;
  groomNickname?: string;
  brideNickname?: string;
}

export const invitationsApi = {
  async getAll() {
    const res = await apiClient.get<ApiResponse<InvitationData[]>>('/invitations');
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get<ApiResponse<InvitationData>>(`/invitations/${id}`);
    return res.data;
  },

  async create(data: CreateInvitationPayload) {
    const res = await apiClient.post<ApiResponse<InvitationData>>('/invitations', data);
    return res.data;
  },

  async saveDraft(id: string, payload: SaveDraftPayload) {
    const res = await apiClient.put<ApiResponse<InvitationData>>(`/invitations/${id}/draft`, payload);
    return res.data;
  },

  async applyTemplate(id: string, templateId: string) {
    const res = await apiClient.post<ApiResponse<InvitationData>>(`/invitations/${id}/apply-template`, { templateId });
    return res.data;
  },

  async publish(id: string) {
    const res = await apiClient.post<ApiResponse<InvitationData>>(`/invitations/${id}/publish`);
    return res.data;
  },

  async unpublish(id: string) {
    const res = await apiClient.post<ApiResponse<InvitationData>>(`/invitations/${id}/unpublish`);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/invitations/${id}`);
    return res.data;
  },
};
