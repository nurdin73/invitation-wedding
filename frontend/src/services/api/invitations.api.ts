import { apiClient, type ApiResponse } from '@/lib/axios';

export interface InvitationData {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeConfig: Record<string, unknown>;
  sections: unknown[];
  isPublished: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
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

  async create(data: { title: string; slug: string }) {
    const res = await apiClient.post<ApiResponse<InvitationData>>('/invitations', data);
    return res.data;
  },

  async saveDraft(id: string, payload: { themeConfig: Record<string, unknown>; sections: unknown[] }) {
    const res = await apiClient.put<ApiResponse<InvitationData>>(`/invitations/${id}/draft`, payload);
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
