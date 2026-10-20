import { apiClient, type ApiResponse } from '@/lib/axios';
import type { InvitationData } from './invitations.api';

export interface RsvpPayload {
  guestName: string;
  attendanceStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'UNCERTAIN';
  guestCount: number;
  message?: string;
}

export const publicApi = {
  async getBySlug(slug: string) {
    const res = await apiClient.get<ApiResponse<InvitationData>>(`/invitations/public/${slug}`);
    return res.data;
  },

  async submitRsvp(invitationId: string, payload: RsvpPayload) {
    const res = await apiClient.post<ApiResponse<{ rsvpId: string }>>(
      `/invitations/${invitationId}/rsvps`,
      payload
    );
    return res.data;
  },
};
