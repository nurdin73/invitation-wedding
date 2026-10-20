import axios, { type AxiosResponse } from 'axios';

export interface ApiResponse<T = unknown> {
  meta: {
    code: number;
    timestamp: string;
    requestId?: string;
  };
  status: 'OK' | 'FAILED';
  message: string;
  data: T;
  errors?: unknown;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan Bearer token jika tersedia di client
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor response untuk normalisasi ApiResponse
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  (error) => {
    const apiError = error.response?.data as ApiResponse<unknown> | undefined;
    if (apiError && apiError.message) {
      return Promise.reject(new Error(apiError.message));
    }
    return Promise.reject(error);
  }
);
