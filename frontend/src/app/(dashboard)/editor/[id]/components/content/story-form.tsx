'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { Heart, Plus, Trash2 } from 'lucide-react';
import type { StoryTimelineItem } from '@/modules/invitation-sections/types';
import { Button } from '@/components/ui/button';
import { ProFeatureLock } from '../pro/pro-feature-lock';

export const StoryForm: React.FC = () => {
  const story = useInvitationEditorStore((s) => s.content.story);
  const updateStory = useInvitationEditorStore((s) => s.updateStory);
  const isPro = useInvitationEditorStore((s) => s.isPro);

  if (!isPro) {
    return (
      <ProFeatureLock
        featureName="Linimasa Kisah Cinta (Love Story)"
        description="Fitur linimasa kisah cinta eksklusif untuk pengguna paket PRO. Ceritakan kembali momen-momen berkesan mulai dari perkenalan, kencan pertama, hingga lamaran."
        perks={[
          'Tampilan kronologis perjalanan cinta yang estetik dan rapi',
          'Penanda tahun dan judul momen kebersamaan yang interaktif',
          'Animasi kartu linimasa yang memukau para tamu undangan',
          'Penyusunan urutan cerita bebas tanpa batasan jumlah',
        ]}
      />
    );
  }

  const handleAddStory = () => {
    const newItem: StoryTimelineItem = {
      id: `st-${Date.now().toString(36)}`,
      year: new Date().getFullYear().toString(),
      title: 'Momen Bahagia',
      story: 'Tuliskan kenangan indah perjalanan cinta Anda...',
    };
    updateStory([...story, newItem]);
  };

  const handleUpdateItem = (id: string, patch: Partial<StoryTimelineItem>) => {
    updateStory(story.map((st) => (st.id === id ? { ...st, ...patch } : st)));
  };

  const handleDeleteItem = (id: string) => {
    updateStory(story.filter((st) => st.id !== id));
  };

  return (
    <div className="space-y-4 text-xs" data-testid="editor-content-story-form">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[11px]">
          Bagikan kisah cinta berkesan Anda kepada para tamu undangan.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStory}
          className="text-xs gap-1.5 h-7"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Cerita</span>
        </Button>
      </div>

      {story.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-border text-center text-muted-foreground opacity-60">
          <Heart className="w-6 h-6 mx-auto mb-1 opacity-50" />
          <p>Belum ada linimasa kisah cinta yang ditambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {story.map((st, idx) => (
            <div
              key={st.id}
              className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2.5 relative"
            >
              <div className="flex items-center justify-between border-b border-border pb-1.5">
                <span className="font-semibold text-[11px] text-primary">
                  Cerita #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(st.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors text-xs"
                  title="Hapus Cerita"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={st.year}
                    onChange={(e) => handleUpdateItem(st.id, { year: e.target.value })}
                    placeholder="2022"
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                    Judul Momen
                  </label>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleUpdateItem(st.id, { title: e.target.value })}
                    placeholder="Contoh: Pertama Bertemu"
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                  Isi Cerita
                </label>
                <textarea
                  rows={2}
                  value={st.story}
                  onChange={(e) => handleUpdateItem(st.id, { story: e.target.value })}
                  placeholder="Ceritakan secara singkat momen manis tersebut..."
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
