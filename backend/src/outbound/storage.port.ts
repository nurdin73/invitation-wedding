export interface PresignedUploadResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface IStoragePort {
  createPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds?: number
  ): Promise<PresignedUploadResult>;
  deleteFile(key: string): Promise<boolean>;
}
