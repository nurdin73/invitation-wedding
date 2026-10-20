import axios from 'axios';
import { apiClient, type ApiResponse } from '@/lib/axios';

export interface PresignedTicket {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export const mediaApi = {
  async getPresignedUrl(filename: string, mimeType: string, fileSize: number) {
    const res = await apiClient.post<ApiResponse<PresignedTicket>>('/media/presigned-url', {
      filename,
      mimeType,
      fileSize,
    });
    return res.data;
  },

  async uploadDirectToStorage(uploadUrl: string, fileBlob: Blob, mimeType: string) {
    // Direct browser upload ke Cloudflare R2 / MinIO via presigned PUT URL
    await axios.put(uploadUrl, fileBlob, {
      headers: {
        'Content-Type': mimeType,
      },
    });
  },

  async delete(key: string) {
    const res = await apiClient.delete<ApiResponse<{ deleted: boolean }>>('/media', {
      params: { key },
    });
    return res.data;
  },
};
