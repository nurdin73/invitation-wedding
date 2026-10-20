import { apiClient, type ApiResponse } from '@/lib/axios';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface AuthResponseData {
  user: UserProfile;
  token: string;
}

export const authApi = {
  async register(data: { email: string; password: string; fullName: string }) {
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
};
