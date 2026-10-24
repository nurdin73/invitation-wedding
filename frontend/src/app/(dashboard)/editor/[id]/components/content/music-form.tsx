'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { Music2, Sparkles, Check } from 'lucide-react';
import { AUDIO_PRESETS } from '@/modules/invitation-sections/audio-presets';
import { AudioUploader } from '@/components/media/audio-uploader';
import { ProFeatureLock } from '../pro/pro-feature-lock';

export const MusicForm: React.FC = () => {
  const music = useInvitationEditorStore((s) => s.content.music);
  const updateMusic = useInvitationEditorStore((s) => s.updateMusic);
  const isPro = useInvitationEditorStore((s) => s.isPro);

  if (!isPro) {
    return (
      <ProFeatureLock
        featureName="Musik Latar Pengiring Romantis"
        description="Fitur musik latar pengiring eksklusif untuk pengguna paket PRO. Tamu undangan Anda akan disambut lantunan musik syahdu saat menekan tombol 'Buka Undangan'."
        perks={[
          'Pemutar musik otomatis saat cover undangan dibuka',
          'Tersedia koleksi lagu instrumen romantis siap pakai',
          'Dukungan unggah file MP3 lagu pilihan Anda sendiri',
          'Tombol kontrol audio melayang yang elegan bagi tamu',
        ]}
      />
    );
  }

  const handleSelectPreset = (url: string) => {
    updateMusic({
      ...music,
      audioUrl: url,
    });
  };

  const handleUploadedCustom = (url: string) => {
    updateMusic({
      ...music,
      audioUrl: url,
    });
  };

  const handleRemoveAudio = () => {
    updateMusic({
      ...music,
      audioUrl: '',
    });
  };

  return (
    <div className="space-y-6 text-xs" data-testid="editor-content-music-form">
      {/* Upload Audio Mandiri */}
      <div className="space-y-2">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <Music2 className="w-4 h-4 text-primary" />
          <span>Unggah Musik Sendiri</span>
        </label>
        <AudioUploader
          currentUrl={music.audioUrl}
          onUploaded={handleUploadedCustom}
          onRemove={handleRemoveAudio}
        />
      </div>

      {/* Pilihan Preset Musik Romantis Siap Pakai */}
      <div className="space-y-3 pt-2 border-t border-border">
        <label className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Atau Pilih Musik Siap Pakai Bebas Royalti:</span>
        </label>

        <div className="space-y-2">
          {AUDIO_PRESETS.map((preset) => {
            const isSelected = music.audioUrl === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-primary ring-1 ring-primary bg-primary/5 text-foreground'
                    : 'border-border bg-card/60 hover:border-primary/40 text-muted-foreground'
                }`}
              >
                <div>
                  <span className="font-semibold text-xs block text-foreground">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Musik instrumental pernikahan
                  </span>
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
