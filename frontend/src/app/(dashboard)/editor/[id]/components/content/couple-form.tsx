'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { User, AtSign, UploadCloud, Loader2 } from 'lucide-react';
import { mediaApi } from '@/services/api/media.api';
import { compressImageToWebP } from '@/lib/image-compressor';
import { toast } from 'sonner';

export const CoupleForm: React.FC = () => {
  const couple = useInvitationEditorStore((s) => s.content.couple);
  const updateCouple = useInvitationEditorStore((s) => s.updateCouple);
  const [uploadingGroom, setUploadingGroom] = React.useState(false);
  const [uploadingBride, setUploadingBride] = React.useState(false);

  const groomFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const brideFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadPhoto = async (
    file: File,
    target: 'groom' | 'bride'
  ) => {
    const isGroom = target === 'groom';
    const setUploading = isGroom ? setUploadingGroom : setUploadingBride;

    setUploading(true);
    try {
      // 1. Kompresi gambar client-side ke WebP (maks 1920px, < 400KB)
      const optimizedFile = await compressImageToWebP(file);

      const ticketRes = await mediaApi.getPresignedUrl(
        optimizedFile.name,
        optimizedFile.type,
        optimizedFile.size
      );

      if (!ticketRes.data?.uploadUrl) {
        throw new Error('Gagal mendapatkan tiket upload penyimpanan.');
      }

      await mediaApi.uploadDirectToStorage(
        ticketRes.data.uploadUrl,
        optimizedFile,
        optimizedFile.type
      );

      const uploadedUrl = ticketRes.data.fileUrl;
      if (isGroom) {
        updateCouple({
          groom: { ...couple.groom, photoUrl: uploadedUrl },
        });
      } else {
        updateCouple({
          bride: { ...couple.bride, photoUrl: uploadedUrl },
        });
      }
      toast.success(`Foto ${isGroom ? 'mempelai pria' : 'mempelai wanita'} berhasil diunggah!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs" data-testid="editor-content-couple-form">
      {/* Mempelai Pria */}
      <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <User className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground">Mempelai Pria (Groom)</h4>
        </div>

        {/* Foto Profil Pria */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0 relative">
            {couple.groom.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={couple.groom.photoUrl}
                alt="Foto Mempelai Pria"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-muted-foreground opacity-50" />
            )}
            {uploadingGroom && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="file"
              ref={groomFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadPhoto(file, 'groom');
              }}
            />
            <button
              type="button"
              disabled={uploadingGroom}
              onClick={() => groomFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background hover:bg-muted text-[11px] font-medium transition-colors"
              data-testid="upload-groom-photo-btn"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{couple.groom.photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
            </button>
            <p className="text-[10px] text-muted-foreground">PNG, JPG, atau WebP maks 5MB.</p>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">
            Nama Panggilan <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={couple.groom.nickname}
            onChange={(e) =>
              updateCouple({ groom: { ...couple.groom, nickname: e.target.value } })
            }
            placeholder="Contoh: Rama"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-groom-nickname"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">Nama Lengkap & Gelar</label>
          <input
            type="text"
            value={couple.groom.fullName}
            onChange={(e) =>
              updateCouple({ groom: { ...couple.groom, fullName: e.target.value } })
            }
            placeholder="Contoh: Rama Dananjaya, S.T."
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-groom-fullname"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">Keluarga / Nama Orang Tua</label>
          <input
            type="text"
            value={couple.groom.parents}
            onChange={(e) =>
              updateCouple({ groom: { ...couple.groom, parents: e.target.value } })
            }
            placeholder="Contoh: Putra pertama dari Bpk. Bambang & Ibu Endang"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-groom-parents"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground flex items-center gap-1">
            <AtSign className="w-3 h-3 text-muted-foreground" />
            <span>Username Instagram</span>
          </label>
          <div className="flex items-center rounded-md border border-input bg-background px-3 py-1 focus-within:ring-1 focus-within:ring-ring">
            <span className="text-muted-foreground select-none">@</span>
            <input
              type="text"
              value={couple.groom.instagram || ''}
              onChange={(e) =>
                updateCouple({
                  groom: { ...couple.groom, instagram: e.target.value.replace('@', '') },
                })
              }
              placeholder="ramadananjaya"
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Mempelai Wanita */}
      <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <User className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground">Mempelai Wanita (Bride)</h4>
        </div>

        {/* Foto Profil Wanita */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0 relative">
            {couple.bride.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={couple.bride.photoUrl}
                alt="Foto Mempelai Wanita"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-muted-foreground opacity-50" />
            )}
            {uploadingBride && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="file"
              ref={brideFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadPhoto(file, 'bride');
              }}
            />
            <button
              type="button"
              disabled={uploadingBride}
              onClick={() => brideFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input bg-background hover:bg-muted text-[11px] font-medium transition-colors"
              data-testid="upload-bride-photo-btn"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{couple.bride.photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
            </button>
            <p className="text-[10px] text-muted-foreground">PNG, JPG, atau WebP maks 5MB.</p>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">
            Nama Panggilan <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={couple.bride.nickname}
            onChange={(e) =>
              updateCouple({ bride: { ...couple.bride, nickname: e.target.value } })
            }
            placeholder="Contoh: Shinta"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-bride-nickname"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">Nama Lengkap & Gelar</label>
          <input
            type="text"
            value={couple.bride.fullName}
            onChange={(e) =>
              updateCouple({ bride: { ...couple.bride, fullName: e.target.value } })
            }
            placeholder="Contoh: Shinta Paramitha, S.Farm."
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-bride-fullname"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground">Keluarga / Nama Orang Tua</label>
          <input
            type="text"
            value={couple.bride.parents}
            onChange={(e) =>
              updateCouple({ bride: { ...couple.bride, parents: e.target.value } })
            }
            placeholder="Contoh: Putri kedua dari Bpk. Raden Soepomo & Ibu Ratna"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            data-testid="editor-content-couple-bride-parents"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground flex items-center gap-1">
            <AtSign className="w-3 h-3 text-muted-foreground" />
            <span>Username Instagram</span>
          </label>
          <div className="flex items-center rounded-md border border-input bg-background px-3 py-1 focus-within:ring-1 focus-within:ring-ring">
            <span className="text-muted-foreground select-none">@</span>
            <input
              type="text"
              value={couple.bride.instagram || ''}
              onChange={(e) =>
                updateCouple({
                  bride: { ...couple.bride, instagram: e.target.value.replace('@', '') },
                })
              }
              placeholder="shintaparamitha"
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
