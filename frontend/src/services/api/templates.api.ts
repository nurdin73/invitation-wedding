import { apiClient, type ApiResponse } from '@/lib/axios';

export interface TemplateData {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  category: string;
  themeConfig: {
    paletteId?: string;
    primaryColor?: string;
    secondaryColor?: string;
    canvasBackground?: string;
    headingFont?: string;
    bodyFont?: string;
    [key: string]: unknown;
  };
  sections: unknown[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const templatesApi = {
  async getAll() {
    const res = await apiClient.get<ApiResponse<TemplateData[]>>('/templates');
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get<ApiResponse<TemplateData>>(`/templates/${id}`);
    return res.data;
  },
};
