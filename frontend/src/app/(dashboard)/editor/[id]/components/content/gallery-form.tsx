'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { Image as ImageIcon, Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { mediaApi } from '@/services/api/media.api';
import { toast } from 'sonner';

export const GalleryForm: React.FC = () => {
  const gallery = useInvitationEditorStore((s) => s.content.gallery);
  const updateGallery = useInvitationEditorStore((s) => s.updateGallery);
  const [isUploading, setIsUploading] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems = [...gallery];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ticketRes = await mediaApi.getPresignedUrl(
          file.name,
          file.type || 'image/jpeg',
          file.size
        );

        if (ticketRes.data?.uploadUrl) {
          await mediaApi.uploadDirectToStorage(
            ticketRes.data.uploadUrl,
            file,
            file.type || 'image/jpeg'
          );
          newItems.push({
            id: `img-${Date.now().toString(36)}-${i}`,
            url: ticketRes.data.fileUrl,
            caption: '',
          });
        }
      }
      updateGallery(newItems);
      toast.success(`${files.length} foto berhasil diunggah ke galeri!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah foto ke galeri.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    updateGallery([
      ...gallery,
      {
        id: `img-${Date.now().toString(36)}`,
        url: manualUrl.trim(),
        caption: '',
      },
    ]);
    setManualUrl('');
  };

  const handleDeleteImage = (id: string) => {
    updateGallery(gallery.filter((img) => img.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    updateGallery(
      gallery.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  return (
    <div className="space-y-4 text-xs" data-testid="editor-content-gallery-form">
      <div className="p-4 rounded-xl border border-dashed border-border bg-card/40 text-center space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUploadFiles(e.target.files)}
        />
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5" />
          )}
        </div>
        <div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium text-xs shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50"
            data-testid="gallery-upload-files-btn"
          >
            <span>{isUploading ? 'Mengunggah Foto...' : 'Pilih Foto dari Perangkat'}</span>
          </button>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Dapat memilih beberapa foto sekaligus (JPG, PNG, WebP).
          </p>
        </div>
      </div>

      {/* Input URL Manual Opsional */}
      <div className="flex gap-2">
        <input
          type="url"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Atau tempel URL foto online (Unsplash, dll)..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono text-[11px]"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3 py-1.5 rounded-md border border-input bg-card hover:bg-muted font-medium text-xs shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Grid Foto yang Sudah Ada */}
      {gallery.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground opacity-60">
          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
          <p>Belum ada foto dalam galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {gallery.map((img, idx) => (
            <div
              key={img.id || idx}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col group relative"
            >
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || `Foto ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors shadow-xs"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="p-2 bg-background border-t border-border">
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                  placeholder="Keterangan foto..."
                  className="w-full bg-transparent border-0 p-0 text-[11px] focus:outline-none text-muted-foreground focus:text-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
