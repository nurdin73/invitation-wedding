'use client';

import * as React from 'react';
import { Disc3, Music2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AUDIO_PRESETS } from './audio-presets';

interface InvitationAudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioUrl?: string;
}

export const InvitationAudioPlayer: React.FC<InvitationAudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  audioUrl,
}) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeUrl = audioUrl?.trim() || AUDIO_PRESETS[0].url;

  // Sinkronisasi state pemutaran audio dengan elemen HTMLAudioElement
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio autoplay dibatasi oleh kebijakan browser sampai interaksi user:', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, activeUrl]);

  return (
    <>
      {/* Hidden Audio Stream Element */}
      <audio
        ref={audioRef}
        src={activeUrl}
        loop
        preload="auto"
      />

      {/* Floating Rotating Disc Controller */}
      <div
        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
        data-testid="invitation-audio-container"
      >
        <button
          type="button"
          onClick={onTogglePlay}
          data-testid="invitation-audio-toggle"
          title={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
          className={cn(
            'group relative w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95',
            isPlaying ? 'bg-primary ring-2 ring-primary/40 ring-offset-2' : 'bg-slate-700/80'
          )}
          style={{ backgroundColor: isPlaying ? 'var(--inv-primary, #B86B70)' : undefined }}
        >
          {isPlaying ? (
            <Disc3 className="w-5 h-5 animate-spin [animation-duration:4s]" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-75" />
          )}

          {/* Micro sound waves pulse when playing */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}
        </button>
      </div>
    </>
  );
};
