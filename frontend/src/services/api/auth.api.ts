import { apiClient, type ApiResponse } from '@/lib/axios';

export type UserRole = 'USER' | 'CONTRIBUTOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthResponseData {
  user: UserProfile;
  token: string;
}

export const authApi = {
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role?: 'USER' | 'CONTRIBUTOR';
  }) {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return res.data;
  },

  async logout() {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  async forgotPassword(data: { email: string }) {
    const res = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', data);
    return res.data;
  },

  async resetPassword(data: { token: string; newPassword: string }) {
    const res = await apiClient.post<ApiResponse<null>>('/auth/reset-password', data);
    return res.data;
  },

  async sendEmailVerification() {
    const res = await apiClient.post<ApiResponse<null>>('/auth/verify-email/send');
    return res.data;
  },

  async confirmEmailVerification(data: { token: string }) {
    const res = await apiClient.post<ApiResponse<null>>('/auth/verify-email/confirm', data);
    return res.data;
  },
};
