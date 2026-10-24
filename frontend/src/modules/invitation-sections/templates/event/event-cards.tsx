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
          {copy?.title || 'Agenda Acara'}
        </h2>
        <p className="text-xs opacity-70 max-w-sm mx-auto">
          {copy?.subtitle || 'Rangkaian momen bahagia pernikahan kami'}
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto w-full">
        {events.map((item: EventItem) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-current/10 bg-current/[0.02] space-y-3 text-left"
          >
            <div className="border-b border-current/10 pb-2 flex items-center justify-between">
              <h3
                className="text-base font-semibold text-[var(--inv-primary)]"
                style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
              >
                {item.eventName || 'Nama Acara'}
              </h3>
            </div>

            <div className="space-y-1.5 text-xs">
              {item.date && (
                <div className="flex items-center gap-2 opacity-80">
                  <Calendar className="w-3.5 h-3.5 text-[var(--inv-primary)] shrink-0" />
                  <span>{formatDateIndonesian(item.date)}</span>
                </div>
              )}
              {item.timeRange && (
                <div className="flex items-center gap-2 opacity-80">
                  <Clock className="w-3.5 h-3.5 text-[var(--inv-primary)] shrink-0" />
                  <span>{item.timeRange}</span>
                </div>
              )}
              {(item.venueName || item.venueAddress) && (
                <div className="flex items-start gap-2 opacity-80 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--inv-primary)] shrink-0 mt-0.5" />
                  <div>
                    {item.venueName && (
                      <p className="font-medium text-foreground">{item.venueName}</p>
                    )}
                    {item.venueAddress && (
                      <p className="opacity-70 text-[11px] leading-relaxed">{item.venueAddress}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {item.mapsUrl && (
              <div className="pt-2">
                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
