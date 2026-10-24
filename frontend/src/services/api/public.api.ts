import { apiClient, type ApiResponse } from '@/lib/axios';
import type { InvitationData } from './invitations.api';

export interface RsvpItem {
  id: string;
  invitationId: string;
  guestName: string;
  attendanceStatus: 'attending' | 'not_attending';
  guestCount: number;
  message: string | null;
  createdAt: string;
}

export interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
}

export interface RsvpListResponse {
  stats: RsvpStats;
  rsvps: RsvpItem[];
}

export interface RsvpPayload {
  guestName: string;
  attendanceStatus: 'attending' | 'not_attending';
  guestCount?: number;
  message?: string;
}

export const publicApi = {
  async getBySlug(slug: string) {
    const res = await apiClient.get<ApiResponse<InvitationData>>(`/invitations/public/${slug}`);
    return res.data;
  },

  async getRsvps(invitationId: string) {
    const res = await apiClient.get<ApiResponse<RsvpListResponse>>(
      `/invitations/${invitationId}/rsvps`
    );
    return res.data;
  },

  async submitRsvp(invitationId: string, payload: RsvpPayload) {
    const res = await apiClient.post<ApiResponse<RsvpItem>>(
      `/invitations/${invitationId}/rsvps`,
      payload
    );
    return res.data;
  },
};
