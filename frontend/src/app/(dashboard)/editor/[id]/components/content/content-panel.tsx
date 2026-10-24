'use client';

import * as React from 'react';
import {
  Users,
  Calendar,
  Quote,
  Image as ImageIcon,
  Gift,
  Music2,
  Heart,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useContentCompleteness } from './use-content-completeness';
import { CoupleForm } from './couple-form';
import { EventsForm } from './events-form';
import { QuoteForm } from './quote-form';
import { GalleryForm } from './gallery-form';
import { GiftForm } from './gift-form';
import { MusicForm } from './music-form';
import { StoryForm } from './story-form';
import { cn } from '@/lib/utils';

type ContentSectionKey = 'couple' | 'events' | 'quote' | 'gallery' | 'gift' | 'music' | 'story';

interface SectionGroup {
  key: ContentSectionKey;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  isRequired?: boolean;
}

const SECTION_GROUPS: SectionGroup[] = [
  {
    key: 'couple',
    title: 'Profil Kedua Mempelai',
    subtitle: 'Nama panggilan, nama lengkap, orang tua, & foto',
    icon: Users,
    component: CoupleForm,
    isRequired: true,
  },
  {
    key: 'events',
    title: 'Agenda Acara Pernikahan',
    subtitle: 'Waktu, tanggal, tempat akad & resepsi, dan peta',
    icon: Calendar,
    component: EventsForm,
    isRequired: true,
  },
  {
    key: 'quote',
    title: 'Kutipan & Ayat Suci',
    subtitle: 'Pesan pembuka atau ayat suci pernikahan',
    icon: Quote,
    component: QuoteForm,
  },
  {
    key: 'gallery',
    title: 'Galeri Foto Kenangan',
    subtitle: 'Unggah momen pre-wedding dan kebersamaan',
    icon: ImageIcon,
    component: GalleryForm,
  },
  {
    key: 'gift',
    title: 'Tanda Kasih & Rekening',
    subtitle: 'Rekening bank, e-wallet, atau alamat kirim kado',
    icon: Gift,
    component: GiftForm,
  },
  {
    key: 'music',
    title: 'Musik Latar Pengiring',
    subtitle: 'Audio pengiring suasana syahdu pernikahan',
    icon: Music2,
    component: MusicForm,
  },
  {
    key: 'story',
    title: 'Linimasa Kisah Cinta',
    subtitle: 'Rangkaian cerita perjalanan cinta Anda',
    icon: Heart,
    component: StoryForm,
  },
];

export const ContentPanel: React.FC = () => {
  const { percentage, isReadyToPublish, items } = useContentCompleteness();
  const [openSection, setOpenSection] = React.useState<ContentSectionKey>('couple');

  const toggleSection = (key: ContentSectionKey) => {
    setOpenSection((prev) => (prev === key ? 'couple' : key));
  };

  return (
    <div className="space-y-4" data-testid="editor-content-panel">
      {/* Kartu Panduan Kelengkapan (Checklist Progress) */}
      <div className="p-3.5 rounded-xl border border-border bg-card-oat/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-xs text-foreground">
              Panduan Pengisian Data
            </span>
          </div>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase',
              isReadyToPublish
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isReadyToPublish ? 'Siap Terbit' : 'Belum Lengkap'}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1 text-muted-foreground">
            <span>Kelengkapan Informasi</span>
            <span className="font-mono font-medium text-foreground">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Mini Checklist Badges */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenSection(item.id as ContentSectionKey)}
              className={cn(
                'flex items-center gap-1.5 p-1.5 rounded-md text-[11px] text-left transition-colors',
                openSection === item.id ? 'bg-primary/10 font-medium' : 'hover:bg-card'
              )}
            >
              {item.isComplete ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : item.isRequired ? (
                <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
              ) : (
                <span className="w-3 h-3 rounded-full border border-muted-foreground/30 shrink-0" />
              )}
              <span className="truncate text-foreground/80">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Daftar Form Konten */}
      <div className="space-y-2">
        {SECTION_GROUPS.map((group) => {
          const isOpen = openSection === group.key;
          const Icon = group.icon;
          const checklistItem = items.find((i) => i.id === group.key);

          return (
            <div
              key={group.key}
              className={cn(
                'rounded-xl border transition-all overflow-hidden bg-card',
                isOpen ? 'border-primary/50 shadow-xs' : 'border-border hover:border-primary/30'
              )}
              data-testid={`content-accordion-${group.key}`}
            >
              <button
                type="button"
                onClick={() => toggleSection(group.key)}
                className="w-full p-3 flex items-center justify-between text-left transition-colors hover:bg-card-oat/30"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      isOpen
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-xs text-foreground truncate">
                        {group.title}
                      </h4>
                      {group.isRequired && (
                        <span className="text-[10px] text-destructive font-bold">*</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {checklistItem?.isComplete ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Terisi" />
                  ) : group.isRequired ? (
                    <span className="text-[10px] text-destructive font-medium">Wajib</span>
                  ) : null}
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-foreground'
                    )}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="p-3.5 pt-1 border-t border-border/60 bg-background/50">
                  <group.component />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
