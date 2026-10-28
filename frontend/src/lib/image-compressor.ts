/**
 * Client-Side Image Optimization Utility
 * Enforces WebP format, maximum dimensions (1920px), and maximum file size (400KB).
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

const DEFAULT_MAX_WIDTH = 1920;
const DEFAULT_MAX_HEIGHT = 1920;
const DEFAULT_QUALITY = 0.82;
const DEFAULT_MAX_SIZE_KB = 400;

/**
 * Calculates resized dimensions while strictly maintaining original aspect ratio.
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { width: Math.max(1, maxWidth), height: Math.max(1, maxHeight) };
  }

  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight, 1);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio),
  };
}

/**
 * Transforms an arbitrary file name to a .webp extension.
 */
export function toWebPFilename(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? originalName.slice(0, lastDotIndex) : originalName;
  return `${baseName}.webp`;
}

/**
 * Compresses an image File or Blob into WebP format within dimensions and size limits.
 */
export async function compressImageToWebP(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Format file "${file.type}" tidak didukung. Harap pilih file gambar.`);
  }

  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const targetQuality = options.quality ?? DEFAULT_QUALITY;
  const maxSizeKB = options.maxSizeKB ?? DEFAULT_MAX_SIZE_KB;

  // Jika di lingkungan non-browser (misal SSR), kembalikan file langsung
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  // Jika file sudah WebP dan ukurannya sudah di bawah target maxSizeKB, kembalikan langsung
  if (file.type === 'image/webp' && file.size <= maxSizeKB * 1024) {
    return file;
  }

  return new Promise<File>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      try {
        const { width, height } = calculateAspectRatioFit(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height,
          maxWidth,
          maxHeight
        );

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context tidak tersedia pada peramban.');
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Fungsi pembantu toBlob dengan kualitas tertentu
        const exportBlob = (q: number): Promise<Blob | null> => {
          return new Promise((res) => {
            canvas.toBlob((blob) => res(blob), 'image/webp', q);
          });
        };

        let currentQuality = targetQuality;
        let blob = await exportBlob(currentQuality);

        // Jika ukuran masih melebihi batas, lakukan penurunan kualitas bertahap
        while (blob && blob.size > maxSizeKB * 1024 && currentQuality > 0.4) {
          currentQuality -= 0.15;
          const smallerBlob = await exportBlob(currentQuality);
          if (smallerBlob) {
            blob = smallerBlob;
          }
        }

        if (!blob) {
          throw new Error('Gagal menghasilkan WebP blob dari canvas.');
        }

        const webpFilename = toWebPFilename(file.name);
        const compressedFile = new File([blob], webpFilename, {
          type: 'image/webp',
          lastModified: Date.now(),
        });

        resolve(compressedFile);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gagal memuat gambar untuk proses kompresi.'));
    };

    img.src = objectUrl;
  });
}
