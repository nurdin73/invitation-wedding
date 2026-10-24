'use client';

import * as React from 'react';
import { Upload, Music, Play, Pause, Trash2, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mediaApi } from '@/services/api/media.api';
import { optimizeAudioFile, type OptimizedAudioResult } from '@/lib/audio-optimizer';

export interface AudioUploaderProps {
  currentUrl?: string;
  onUploaded: (url: string, duration?: number) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function AudioUploader({
  currentUrl,
  onUploaded,
  onRemove,
  disabled = false,
}: AudioUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStatus, setProcessingStatus] = React.useState<string>('');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [uploadStats, setUploadStats] = React.useState<OptimizedAudioResult | null>(null);

  // Sinkronisasi state play/pause audio lokal
  const togglePlay = () => {
    if (!audioRef.current || !currentUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Gagal memutar audio:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input agar bisa memilih berkas yang sama jika diinginkan
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsProcessing(true);
    setProcessingStatus('Memeriksa & mengoptimasi audio...');

    try {
      // 1. Optimasi & kompresi di sisi browser
      const optimized = await optimizeAudioFile(file, {
        maxDurationSeconds: 180, // Maksimal 3 menit untuk loop
        maxSizeBytes: 3.5 * 1024 * 1024, // Maksimal 3.5 MB
      });

      setUploadStats(optimized);
      setProcessingStatus('Mengunggah berkas teroptimasi...');

      // 2. Minta presigned URL dari backend
      const presignedRes = await mediaApi.getPresignedUrl(
        optimized.filename,
        optimized.mimeType,
        optimized.optimizedSize
      );

      if (!presignedRes.data?.uploadUrl || !presignedRes.data?.fileUrl) {
        throw new Error('Gagal mendapatkan tiket upload penyimpanan.');
      }

      // 3. Upload langsung dari browser ke Cloudflare R2 / S3
      await mediaApi.uploadDirectToStorage(
        presignedRes.data.uploadUrl,
        optimized.blob,
        optimized.mimeType
      );

      // 4. Update callback
      onUploaded(presignedRes.data.fileUrl, optimized.duration);

      const sizeSavedMB = ((optimized.originalSize - optimized.optimizedSize) / (1024 * 1024)).toFixed(1);
      if (optimized.compressionRatio > 0.05) {
        toast.success(
          `Musik berhasil diunggah! Teroptimasi hemat ${Math.round(optimized.compressionRatio * 100)}% (${sizeSavedMB} MB).`
        );
      } else {
        toast.success('Musik latar berhasil diunggah dan siap diputar.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah musik.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleTriggerUpload = () => {
    if (disabled || isProcessing) return;
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-3" data-testid="audio-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/m4a,audio/aac,audio/ogg,audio/wav"
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
        className="hidden"
        data-testid="audio-uploader-input"
      />

      {currentUrl && (
        <audio
          ref={audioRef}
          src={currentUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {currentUrl ? (
        /* Tampilan Berkas Musik yang Sudah Diunggah */
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={togglePlay}
                disabled={disabled}
                className="w-10 h-10 rounded-full shrink-0 border-primary/30 text-primary hover:bg-accent-tint"
                data-testid="audio-uploader-play-btn"
                title={isPlaying ? 'Jeda Pratinjau' : 'Putar Pratinjau'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                    Musik Latar Pengantin
                  </span>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-[10px] gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terunggah</span>
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {uploadStats
                    ? `Ukuran: ${formatFileSize(uploadStats.optimizedSize)} • Durasi: ${formatDuration(uploadStats.duration)}`
                    : 'Berkas audio siap diputar di undangan digital'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerUpload}
                disabled={disabled || isProcessing}
                className="text-xs h-8"
                data-testid="audio-uploader-replace-btn"
              >
                Ganti
              </Button>

              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  disabled={disabled || isProcessing}
                  className="w-8 h-8 text-destructive hover:bg-destructive/10"
                  data-testid="audio-uploader-remove-btn"
                  title="Hapus Musik"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {uploadStats && uploadStats.compressionRatio > 0.05 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-tint/60 text-[11px] text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                Optimasi aktif: Berkas terkompresi hemat {Math.round(uploadStats.compressionRatio * 100)}% ({formatFileSize(uploadStats.originalSize)} ➔ {formatFileSize(uploadStats.optimizedSize)}).
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Area Unggah Berkas Baru */
        <div
          onClick={handleTriggerUpload}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            disabled
              ? 'border-border/60 bg-muted/40 cursor-not-allowed opacity-60'
              : isProcessing
              ? 'border-primary/40 bg-accent-tint/30 cursor-wait'
              : 'border-border hover:border-primary/50 hover:bg-accent-tint/20 bg-card cursor-pointer shadow-2xs'
          }`}
          data-testid="audio-uploader-dropzone"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <span className="text-xs font-semibold text-foreground">{processingStatus}</span>
              <span className="text-[11px] text-muted-foreground">
                Mengompresi agar audio ringan dan cepat dimuat di HP tamu
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-accent-tint text-primary flex items-center justify-center shadow-2xs">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {disabled ? 'Unggah Musik Khusus Paket PRO' : 'Klik untuk Unggah Berkas Musik Anda'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Mendukung format MP3, M4A, AAC, atau WAV (Maks. 15MB • Otomatis dioptimasi ke 3.5MB loop)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
