'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Send, CheckCircle2, MessageSquare, Users, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publicApi, type RsvpItem, type RsvpStats } from '@/services/api/public.api';

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Baru saja';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} hari lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export const RsvpInteractive: React.FC<SectionRenderProps<'rsvp'>> = ({
  copy,
  isEditor,
  invitationId,
}) => {
  const [name, setName] = React.useState('');
  const [presence, setPresence] = React.useState<'attending' | 'not_attending'>('attending');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [rsvps, setRsvps] = React.useState<RsvpItem[]>([]);
  const [stats, setStats] = React.useState<RsvpStats>({
    total: 0,
    attending: 0,
    notAttending: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Ambil data ucapan & kehadiran nyata dari database
  React.useEffect(() => {
    if (!invitationId) return;

    let isMounted = true;
    setIsLoading(true);

    publicApi
      .getRsvps(invitationId)
      .then((res) => {
        if (isMounted && res.data) {
          setRsvps(res.data.rsvps || []);
          setStats(
            res.data.stats || {
              total: 0,
              attending: 0,
              notAttending: 0,
            }
          );
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat daftar RSVP:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Di mode editor hanya mensimulasikan tanpa mengubah database
    if (isEditor) {
      setIsSubmitted(true);
      return;
    }

    if (!invitationId) {
      setErrorMessage('ID Undangan tidak ditemukan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await publicApi.submitRsvp(invitationId, {
        guestName: trimmedName,
        attendanceStatus: presence,
        guestCount: 1,
        message: message.trim() || undefined,
      });

      if (res.data) {
        setIsSubmitted(true);
        const newRsvp = res.data;
        setRsvps((prev) => [newRsvp, ...prev]);
        setStats((prev) => ({
          total: prev.total + 1,
          attending: presence === 'attending' ? prev.attending + 1 : prev.attending,
          notAttending: presence === 'not_attending' ? prev.notAttending + 1 : prev.notAttending,
        }));
        setName('');
        setMessage('');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      data-testid="section-rsvp-interactive"
      className="relative w-full py-16 px-6 text-center space-y-6 flex flex-col justify-center items-center min-h-[60vh]"
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
          {copy?.title || 'Konfirmasi Kehadiran & Doa Restu'}
        </h2>
        <p className="text-xs opacity-70 max-w-sm mx-auto">
          {copy?.subtitle ||
            'Kirimkan ucapan dan konfirmasi kehadiran Anda untuk menyempurnakan hari bahagia kami'}
        </p>
      </div>

      <div className="max-w-sm mx-auto text-left w-full space-y-5">
        {/* Ringkasan Kehadiran */}
        {stats.total > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-current/10 bg-current/[0.02] text-xs">
            <div className="flex items-center gap-1.5 opacity-80">
              <Users className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
              <span>{stats.total} Tamu Merespon</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="text-emerald-600 dark:text-emerald-400">
                {stats.attending} Hadir
              </span>
              <span className="opacity-40">•</span>
              <span className="opacity-60">{stats.notAttending} Berhalangan</span>
            </div>
          </div>
        )}

        {/* Form RSVP */}
        {isSubmitted && !isEditor ? (
          <div className="p-6 rounded-2xl border border-current/15 bg-current/[0.03] text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--inv-primary)]" />
            <h3 className="font-semibold text-sm">Terima Kasih!</h3>
            <p className="text-xs opacity-75">
              Konfirmasi dan doa restu Anda telah kami terima dengan bahagia.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitted(false)}
              className="text-xs"
            >
              Kirim Ucapan Lain
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl border border-current/10 bg-current/[0.02] space-y-3.5"
            data-testid="rsvp-form"
          >
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                disabled={isSubmitting}
                className="w-full text-xs rounded-lg border border-current/20 bg-background/80 px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)] disabled:opacity-50"
                data-testid="rsvp-name-input"
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
                  disabled={isSubmitting}
                  data-testid="rsvp-presence-attending"
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    presence === 'attending'
                      ? 'border-[var(--inv-primary)] text-white'
                      : 'border-current/20 opacity-70'
                  }`}
                  style={{
                    backgroundColor:
                      presence === 'attending' ? 'var(--inv-primary)' : 'transparent',
                  }}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setPresence('not_attending')}
                  disabled={isSubmitting}
                  data-testid="rsvp-presence-not-attending"
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    presence === 'not_attending'
                      ? 'border-[var(--inv-primary)] text-white'
                      : 'border-current/20 opacity-70'
                  }`}
                  style={{
                    backgroundColor:
                      presence === 'not_attending' ? 'var(--inv-primary)' : 'transparent',
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
                disabled={isSubmitting}
                placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
                className="w-full text-xs rounded-lg border border-current/20 bg-background/80 px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)] resize-none disabled:opacity-50"
                data-testid="rsvp-message-input"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !name.trim()}
              className="w-full text-xs font-medium text-white flex items-center justify-center gap-1.5"
              style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
              data-testid="rsvp-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Konfirmasi</span>
                </>
              )}
            </Button>
          </form>
        )}

        {/* Live Comments Stream dari Database */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-70">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
              <span>Doa Restu Terbaru ({rsvps.length} Ucapan)</span>
            </div>
            {isLoading && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                <span>Memuat...</span>
              </span>
            )}
          </div>

          {rsvps.length === 0 && !isLoading ? (
            <div className="p-4 rounded-xl border border-current/10 bg-current/[0.01] text-center text-xs opacity-60">
              Belum ada ucapan doa. Jadilah yang pertama memberikan doa restu!
            </div>
          ) : (
            <div className="space-y-2 text-xs max-h-[360px] overflow-y-auto pr-1">
              {rsvps.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-current/10 bg-current/[0.015] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-xs">
                        {item.guestName}
                      </span>
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                          item.attendanceStatus === 'attending'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.attendanceStatus === 'attending' ? 'Hadir' : 'Berhalangan'}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-60">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  {item.message && (
                    <p className="opacity-80 text-[11px] leading-relaxed pt-0.5 whitespace-pre-wrap">
                      {item.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
