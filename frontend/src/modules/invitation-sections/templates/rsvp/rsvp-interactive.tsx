'use client';

import * as React from 'react';
import type { SectionRenderProps, RsvpSectionData } from '../../types';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RsvpInteractive: React.FC<SectionRenderProps<'rsvp'>> = ({ data, isEditor }) => {
  const rsvp = data as RsvpSectionData;
  const [name, setName] = React.useState('');
  const [presence, setPresence] = React.useState<'attending' | 'not_attending'>('attending');
  const [message, setMessage] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section
      data-testid="section-rsvp-interactive"
      className="relative w-full py-12 px-6 text-center space-y-6"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-1">
        <h2
          className="text-2xl font-normal"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {rsvp.title || 'Konfirmasi Kehadiran & Doa Restu'}
        </h2>
        <p className="text-xs opacity-70">
          {rsvp.subtitle || 'Kirimkan ucapan dan konfirmasi kehadiran Anda untuk menyempurnakan hari bahagia kami'}
        </p>
      </div>

      <div className="max-w-sm mx-auto text-left">
        {isSubmitted && !isEditor ? (
          <div className="p-6 rounded-2xl border border-current/15 bg-current/[0.03] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--inv-primary)]" />
            <h3 className="font-semibold text-sm">Terima Kasih!</h3>
            <p className="text-xs opacity-75">
              Konfirmasi dan doa restu Anda telah kami terima dengan bahagia.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl border border-current/10 bg-current/[0.02] space-y-3.5"
          >
            <div>
              <label className="block text-xs font-medium mb-1 opacity-80">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bpk. Ahmad Subarjo"
                className="w-full text-xs rounded-lg border border-current/20 bg-background/80 px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 opacity-80">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPresence('attending')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    presence === 'attending'
                      ? 'border-[var(--inv-primary)] text-white'
                      : 'border-current/20 opacity-70'
                  }`}
                  style={{
                    backgroundColor: presence === 'attending' ? 'var(--inv-primary)' : 'transparent',
                  }}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setPresence('not_attending')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    presence === 'not_attending'
                      ? 'border-[var(--inv-primary)] text-white'
                      : 'border-current/20 opacity-70'
                  }`}
                  style={{
                    backgroundColor: presence === 'not_attending' ? 'var(--inv-primary)' : 'transparent',
                  }}
                >
                  Maaf, Berhalangan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 opacity-80">
                Ucapan & Doa Restu
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
                className="w-full text-xs rounded-lg border border-current/20 bg-background/80 px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)] resize-none"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full text-xs font-medium text-white flex items-center justify-center gap-1.5"
              style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi</span>
            </Button>
          </form>
        )}

        {/* Mock Comments Stream */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold opacity-70">
            <MessageSquare className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
            <span>Doa Restu Terbaru (2 Ucapan)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-current/10 bg-current/[0.015]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-foreground">Hendra & Keluarga</span>
                <span className="text-[10px] opacity-60">1 jam lalu</span>
              </div>
              <p className="opacity-80 text-[11px] leading-relaxed">
                Barakallahu lakuma wa baraka alaikuma wa jama&apos;a bainakuma fii khoir. Selamat menempuh hidup baru!
              </p>
            </div>
            <div className="p-3 rounded-xl border border-current/10 bg-current/[0.015]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-foreground">Anisa Rahma</span>
                <span className="text-[10px] opacity-60">3 jam lalu</span>
              </div>
              <p className="opacity-80 text-[11px] leading-relaxed">
                Semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin ya rabbal alamin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
