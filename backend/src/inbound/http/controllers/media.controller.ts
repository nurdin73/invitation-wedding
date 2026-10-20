import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { IMediaService } from '../../../services/media.service';

export class MediaController {
  constructor(private readonly mediaService: IMediaService) {}

  async requestPresignedUrl(
    userId: string,
    payload: { filename: string; mimeType: string; fileSize: number }
  ) {
    const result = await this.mediaService.requestPresignedUpload(
      userId,
      payload.filename,
      payload.mimeType,
      payload.fileSize
    );
    return ResponseHelper.success(
      result,
      'Presigned upload URL berhasil dibuat.',
      META_CODES.MEDIA_UPLOAD_READY
    );
  }

  async deleteMedia(userId: string, key: string) {
    const result = await this.mediaService.deleteMedia(userId, key);
    return ResponseHelper.success(
      { deleted: result },
      'Media berhasil dihapus.',
      META_CODES.SUCCESS_OK
    );
  }
}
