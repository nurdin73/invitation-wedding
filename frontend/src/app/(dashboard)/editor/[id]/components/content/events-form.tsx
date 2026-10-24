'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { Calendar, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import type { EventItem } from '@/modules/invitation-sections/types';
import { Button } from '@/components/ui/button';

export const EventsForm: React.FC = () => {
  const events = useInvitationEditorStore((s) => s.content.events);
  const updateEvents = useInvitationEditorStore((s) => s.updateEvents);

  const handleUpdateItem = (id: string, patch: Partial<EventItem>) => {
    const updated = events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev));
    updateEvents(updated);
  };

  const handleAddEvent = () => {
    const newId = `ev-${Date.now().toString(36)}`;
    const newEvent: EventItem = {
      id: newId,
      eventName: 'Resepsi Tambahan',
      date: events[0]?.date || '',
      timeRange: '19:00 - 21:00 WIB',
      venueName: '',
      venueAddress: '',
      mapsUrl: '',
    };
    updateEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    if (events.length <= 1) return;
    updateEvents(events.filter((ev) => ev.id !== id));
  };

  return (
    <div className="space-y-4 text-xs" data-testid="editor-content-events-form">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[11px]">
          Susun waktu dan lokasi acara pernikahan Anda.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddEvent}
          className="text-xs gap-1.5 h-7"
          data-testid="add-event-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Acara</span>
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((ev, idx) => (
          <div
            key={ev.id}
            className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative group"
            data-testid={`event-item-form-${ev.id}`}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">
                  Acara #{idx + 1} - {ev.eventName || 'Agenda'}
                </h4>
              </div>

              {events.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors text-xs flex items-center gap-1"
                  title="Hapus Acara"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 text-foreground">Nama Acara</label>
              <input
                type="text"
                value={ev.eventName}
                onChange={(e) => handleUpdateItem(ev.id, { eventName: e.target.value })}
                placeholder="Contoh: Akad Nikah / Pemberkatan / Resepsi"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>Tanggal Acara</span>
                </label>
                <input
                  type="date"
                  value={ev.date}
                  onChange={(e) => handleUpdateItem(ev.id, { date: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>Waktu Acara</span>
                </label>
                <input
                  type="text"
                  value={ev.timeRange}
                  onChange={(e) => handleUpdateItem(ev.id, { timeRange: e.target.value })}
                  placeholder="08:00 - 10:00 WIB"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span>Nama Lokasi / Gedung</span>
              </label>
              <input
                type="text"
                value={ev.venueName}
                onChange={(e) => handleUpdateItem(ev.id, { venueName: e.target.value })}
                placeholder="Contoh: Masjid Agung Al-Azhar / Ballroom Hotel Mulia"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-foreground">Alamat Lengkap</label>
              <textarea
                rows={2}
                value={ev.venueAddress}
                onChange={(e) => handleUpdateItem(ev.id, { venueAddress: e.target.value })}
                placeholder="Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-foreground">Tautan Google Maps</label>
              <input
                type="url"
                value={ev.mapsUrl || ''}
                onChange={(e) => handleUpdateItem(ev.id, { mapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono text-[11px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
