export interface PresignedUploadResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface IMediaService {
  requestPresignedUpload(
    userId: string,
    filename: string,
    mimeType: string,
    fileSize: number
  ): Promise<PresignedUploadResponse>;
  deleteMedia(userId: string, key: string): Promise<boolean>;
}
