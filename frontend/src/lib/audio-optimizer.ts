export interface OptimizeAudioOptions {
  maxDurationSeconds?: number;
  maxSizeBytes?: number;
}

export interface OptimizedAudioResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  duration: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

const SUPPORTED_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/m4a',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
  'audio/wav',
  'audio/x-wav',
]);

const SUPPORTED_EXTENSIONS = new Set(['mp3', 'm4a', 'aac', 'ogg', 'webm', 'wav']);

/**
 * Membaca durasi audio menggunakan elemen Audio HTML5 native
 */
export async function getAudioDuration(file: File | Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);
    audio.preload = 'metadata';
    audio.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      audio.remove();
    };

    audio.onloadedmetadata = () => {
      const dur = audio.duration;
      cleanup();
      if (!Number.isFinite(dur) || dur <= 0) {
        resolve(180); // Fallback durasi default jika tidak terdeteksi
      } else {
        resolve(dur);
      }
    };

    audio.onerror = () => {
      cleanup();
      reject(new Error('Berkas audio tidak dapat dibaca atau format tidak valid.'));
    };
  });
}

/**
 * Mencari batas frame MP3 berikutnya untuk slicing frame-safe
 */
function findNextMp3Frame(buffer: Uint8Array, start: number): number {
  for (let i = start; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xff && (buffer[i + 1] & 0xe0) === 0xe0) {
      return i;
    }
  }
  return -1;
}

/**
 * Mengoptimasi berkas audio di browser sebelum diunggah ke storage
 */
export async function optimizeAudioFile(
  file: File,
  options: OptimizeAudioOptions = {}
): Promise<OptimizedAudioResult> {
  const { maxDurationSeconds = 180, maxSizeBytes = 3.5 * 1024 * 1024 } = options;

  // 1. Validasi ekstensi & MIME type
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  const isMimeSupported = SUPPORTED_MIME_TYPES.has(mimeType);
  const isExtSupported = SUPPORTED_EXTENSIONS.has(ext);

  if (!isMimeSupported && !isExtSupported) {
    throw new Error(
      `Format berkas "${file.name}" tidak didukung. Format yang diizinkan: MP3, M4A, AAC, OGG, atau WAV.`
    );
  }

  // Batas absolut awal: 15 MB
  if (file.size > 15 * 1024 * 1024) {
    throw new Error(
      `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) terlalu besar. Batas maksimal sebelum optimasi adalah 15 MB.`
    );
  }

  // 2. Baca durasi audio
  let duration = 0;
  try {
    duration = await getAudioDuration(file);
  } catch (err) {
    console.warn('Gagal membaca metadata durasi audio:', err);
    duration = 180;
  }

  let finalBlob: Blob = file;
  let finalDuration = duration;

  // 3. Jika berkas MP3 dan durasi lebih dari maxDurationSeconds (misal lagu 5-6 menit),
  // potong frame secara presisi agar ukuran berkas hemat dan pas untuk background loop
  const isMp3 = ext === 'mp3' || mimeType === 'audio/mpeg' || mimeType === 'audio/mp3';
  if (isMp3 && duration > maxDurationSeconds) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Hitung rasio pemotongan (misal 180s dari 360s = 50%)
      const ratio = Math.min(1, maxDurationSeconds / duration);
      const targetByteLength = Math.floor(bytes.length * ratio);

      // Cari batas frame MPEG di sekitar targetByteLength
      const safeCutIndex = findNextMp3Frame(bytes, Math.max(0, targetByteLength - 2000));
      const cutPoint = safeCutIndex > 0 ? safeCutIndex : targetByteLength;

      const trimmedBytes = bytes.subarray(0, cutPoint);
      finalBlob = new Blob([trimmedBytes], { type: 'audio/mpeg' });
      finalDuration = maxDurationSeconds;
    } catch (err) {
      console.warn('Gagal memotong frame MP3:', err);
      finalBlob = file;
    }
  }

  // 4. Verifikasi ukuran akhir
  if (finalBlob.size > maxSizeBytes) {
    const sizeInMB = (finalBlob.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Ukuran musik (${sizeInMB} MB) masih melebihi batas optimal 3.5 MB agar tidak lambat saat dibuka tamu undangan. Mohon pilih lagu dengan bitrate lebih hemat (MP3 128kbps) atau durasi di bawah 3 menit.`
    );
  }

  const originalSize = file.size;
  const optimizedSize = finalBlob.size;
  const compressionRatio =
    originalSize > 0 ? Math.max(0, (originalSize - optimizedSize) / originalSize) : 0;

  // Sanitasi nama berkas
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  const finalFilename = `${cleanBaseName}_optimized.${isMp3 ? 'mp3' : ext || 'mp3'}`;

  return {
    blob: finalBlob,
    filename: finalFilename,
    mimeType: isMp3 ? 'audio/mpeg' : file.type || 'audio/mpeg',
    duration: finalDuration,
    originalSize,
    optimizedSize,
    compressionRatio,
  };
}
