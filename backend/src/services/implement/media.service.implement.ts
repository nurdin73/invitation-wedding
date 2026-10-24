import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IStoragePort } from '../../outbound/storage.port';
import type { IMediaService, PresignedUploadResponse } from '../media.service';

const ALLOWED_MIME_TYPES = new Set([
  'image/webp',
  'image/png',
  'image/jpeg',
  'audio/mpeg',
  'audio/mp3',
  'audio/webm',
  'audio/ogg',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/aac',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export class MediaServiceImplement implements IMediaService {
  constructor(private readonly storagePort: IStoragePort) {}

  async requestPresignedUpload(
    userId: string,
    filename: string,
    mimeType: string,
    fileSize: number
  ): Promise<PresignedUploadResponse> {
    if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      throw new AppDomainError(
        META_CODES.UNSUPPORTED_MIME_TYPE,
        `Tipe file "${mimeType}" tidak didukung. Format yang diizinkan: WebP, PNG, JPEG, MP3, M4A, AAC, WAV, WebM, dan OGG.`,
        415
      );
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      throw new AppDomainError(
        META_CODES.FILE_SIZE_EXCEEDED,
        'Ukuran file melebihi batas maksimal 10MB.',
        413
      );
    }

    const cleanName = filename.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const key = `users/${userId}/media/${Date.now()}_${cleanName}`;

    return await this.storagePort.createPresignedUploadUrl(key, mimeType, 3600);
  }

  async deleteMedia(_userId: string, key: string): Promise<boolean> {
    return await this.storagePort.deleteFile(key);
  }
}
