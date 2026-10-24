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
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 sm:space-y-8 flex flex-col justify-center items-center"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-2 max-w-sm sm:max-w-xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.title || 'Konfirmasi Kehadiran & Doa Restu'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle ||
            'Kirimkan ucapan dan konfirmasi kehadiran Anda untuk menyempurnakan hari bahagia kami'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="inv-grid-2-cols gap-6 sm:gap-8 lg:gap-10 max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto w-full pt-2 sm:pt-4 text-left items-start">
        {/* Left Column: Form RSVP / Success State */}
        <div className="w-full">
          {isSubmitted && !isEditor ? (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md text-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3
                className="font-medium text-lg text-foreground"
                style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
              >
                Terima Kasih Atas Doa Restunya
              </h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-xs mx-auto">
                Konfirmasi dan doa restu Anda telah tersimpan dengan indah di buku tamu kami.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSubmitted(false)}
                className="text-xs rounded-full px-5 py-2 border-[var(--inv-primary)]/30 hover:bg-[var(--inv-primary)] hover:text-white transition-all"
              >
                Kirim Ucapan Lain
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3.5 sm:space-y-4"
              data-testid="rsvp-form"
            >
              <div className="border-b border-current/10 pb-3 flex items-center justify-between">
                <h3
                  className="text-base sm:text-lg font-medium text-[var(--inv-primary)]"
                  style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
                >
                  Buku Tamu & RSVP
                </h3>
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-medium">
                  Konfirmasi Online
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium opacity-85">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bpk. Ahmad Subarjo"
                  disabled={isSubmitting}
                  className="w-full text-xs sm:text-sm rounded-xl border border-current/20 bg-background/80 px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)] disabled:opacity-50 transition-all"
                  data-testid="rsvp-name-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium opacity-85">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setPresence('attending')}
                    disabled={isSubmitting}
                    data-testid="rsvp-presence-attending"
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      presence === 'attending'
                        ? 'border-[var(--inv-primary)] text-white shadow-xs'
                        : 'border-current/20 opacity-70 hover:opacity-100 bg-background/50'
                    }`}
                    style={{
                      backgroundColor:
                        presence === 'attending' ? 'var(--inv-primary)' : 'transparent',
                    }}
                  >
                    ✓ Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresence('not_attending')}
                    disabled={isSubmitting}
                    data-testid="rsvp-presence-not-attending"
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      presence === 'not_attending'
                        ? 'border-[var(--inv-primary)] text-white shadow-xs'
                        : 'border-current/20 opacity-70 hover:opacity-100 bg-background/50'
                    }`}
                    style={{
                      backgroundColor:
                        presence === 'not_attending' ? 'var(--inv-primary)' : 'transparent',
                    }}
                  >
                    ✕ Maaf, Berhalangan
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium opacity-85">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Tuliskan doa tulus untuk kedua mempelai..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-current/20 bg-background/80 px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--inv-primary)] resize-none disabled:opacity-50 transition-all"
                  data-testid="rsvp-message-input"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !name.trim()}
                className="w-full py-2.5 text-xs sm:text-sm font-medium text-white flex items-center justify-center gap-2 rounded-xl transition-all shadow-xs hover:opacity-90 active:scale-[0.99]"
                style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
                data-testid="rsvp-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Ucapan & Doa</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Right Column: Live Guestbook Stream & Stats */}
        <div className="w-full space-y-4">
          {/* Ringkasan Kehadiran */}
          {stats.total > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--inv-primary)]/20 bg-white/60 dark:bg-black/25 backdrop-blur-xs text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center gap-2 opacity-85">
                <Users className="w-4 h-4 text-[var(--inv-primary)]" />
                <span className="font-medium">{stats.total} Tamu Merespon</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {stats.attending} Hadir
                </span>
                <span className="opacity-40">•</span>
                <span className="opacity-60">{stats.notAttending} Berhalangan</span>
              </div>
            </div>
          )}

          {/* Live Comments Stream */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--inv-primary)]" />
                <h3
                  className="font-medium text-base text-[var(--inv-primary)]"
                  style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
                >
                  Doa Restu Tamu ({rsvps.length})
                </h3>
              </div>
              {isLoading && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Memuat...</span>
                </span>
              )}
            </div>

            {rsvps.length === 0 && !isLoading ? (
              <div className="py-12 px-4 text-center text-xs sm:text-sm opacity-60 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-[var(--inv-primary)] opacity-40 mb-2" />
                <p>Belum ada ucapan doa yang dikirimkan.</p>
                <p className="text-[11px] opacity-75">Jadilah yang pertama memberikan doa restu!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1">
                {rsvps.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-current/10 bg-white/60 dark:bg-black/20 space-y-2 hover:border-[var(--inv-primary)]/30 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--inv-primary)]/10 text-[var(--inv-primary)] font-semibold flex items-center justify-center text-[10px] shrink-0">
                          {item.guestName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground text-xs sm:text-sm">
                          {item.guestName}
                        </span>
                        <span
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
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
                      <p className="opacity-80 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap pl-8">
                        {item.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
