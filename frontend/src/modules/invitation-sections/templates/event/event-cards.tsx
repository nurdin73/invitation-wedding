'use client';

import * as React from 'react';
import type { SectionRenderProps, EventItem } from '../../types';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { formatDateIndonesian } from '../../content-format.utils';

export const EventCards: React.FC<SectionRenderProps<'event'>> = ({
  content,
  copy,
  isEditor,
}) => {
  const events = (content?.events && content.events.length > 0)
    ? content.events
    : (isEditor
        ? [
            {
              id: 'sample-1',
              eventName: 'Akad Nikah',
              date: '2026-10-28',
              timeRange: '08:00 - 10:00 WIB',
              venueName: 'Nama Tempat / Gedung',
              venueAddress: 'Alamat lengkap tempat pelaksanaan acara',
              mapsUrl: '',
            },
          ]
        : []);

  return (
    <section
      data-testid="section-event-cards"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 sm:space-y-8 flex flex-col justify-center items-center min-h-[100dvh] min-h-screen"
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
          {copy?.title || 'Agenda Acara'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle || 'Rangkaian momen bahagia pernikahan kami'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="inv-grid-2-cols gap-4 sm:gap-6 lg:gap-8 max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto w-full pt-2 sm:pt-4">
        {events.map((item: EventItem, idx: number) => (
          <div
            key={item.id}
            className="relative flex flex-col justify-between p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300 space-y-4 sm:space-y-5 text-left"
          >
            <div className="space-y-4">
              <div className="border-b border-current/10 pb-3 flex items-center justify-between">
                <h3
                  className="text-lg sm:text-xl font-medium tracking-tight text-[var(--inv-primary)]"
                  style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
                >
                  {item.eventName || 'Nama Acara'}
                </h3>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 text-[var(--inv-primary)]">
                  Acara #{idx + 1}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {item.date && (
                  <div className="flex items-center gap-3 opacity-85">
                    <div className="w-7 h-7 rounded-full bg-[var(--inv-primary)]/10 flex items-center justify-center shrink-0 text-[var(--inv-primary)]">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{formatDateIndonesian(item.date)}</span>
                  </div>
                )}
                {item.timeRange && (
                  <div className="flex items-center gap-3 opacity-85">
                    <div className="w-7 h-7 rounded-full bg-[var(--inv-primary)]/10 flex items-center justify-center shrink-0 text-[var(--inv-primary)]">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.timeRange}</span>
                  </div>
                )}
                {(item.venueName || item.venueAddress) && (
                  <div className="flex items-start gap-3 opacity-85 pt-1">
                    <div className="w-7 h-7 rounded-full bg-[var(--inv-primary)]/10 flex items-center justify-center shrink-0 text-[var(--inv-primary)] mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      {item.venueName && (
                        <p className="font-semibold text-foreground">{item.venueName}</p>
                      )}
                      {item.venueAddress && (
                        <p className="opacity-75 text-[11px] sm:text-xs leading-relaxed">
                          {item.venueAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {item.mapsUrl && (
              <div className="pt-2">
                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-white transition-all shadow-xs hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
