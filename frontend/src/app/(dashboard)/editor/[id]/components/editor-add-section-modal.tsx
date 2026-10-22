'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Heart,
  Quote,
  Users,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Gift,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import type { SectionType } from '@/modules/invitation-sections/types';

interface SectionCatalogItem {
  type: SectionType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTION_CATALOG: SectionCatalogItem[] = [
  {
    type: 'hero',
    title: 'Cover & Pembuka (Hero)',
    description: 'Header utama dengan nama kedua mempelai, tanggal acara, dan kata sambutan pembuka.',
    icon: Heart,
  },
  {
    type: 'quote',
    title: 'Kutipan Suci / Mutiara',
    description: 'Ayat suci pernikahan (QS. Ar-Rum) atau kutipan romantis penuh makna.',
    icon: Quote,
  },
  {
    type: 'couple',
    title: 'Profil Kedua Mempelai',
    description: 'Foto, nama lengkap, gelar, orang tua, dan akun sosial media mempelai.',
    icon: Users,
  },
  {
    type: 'event',
    title: 'Agenda Acara & Peta',
    description: 'Waktu, tanggal, lokasi gedung Akad dan Resepsi serta integrasi Google Maps.',
    icon: Calendar,
  },
  {
    type: 'story',
    title: 'Kisah Cinta (Love Story)',
    description: 'Linimasa perjalanan cinta kedua mempelai dari awal bertemu hingga menuju pelaminan.',
    icon: Sparkles,
  },
  {
    type: 'gallery',
    title: 'Galeri Foto Pre-Wedding',
    description: 'Kumpulan foto momen bahagia dengan tata letak grid estetis.',
    icon: ImageIcon,
  },
  {
    type: 'rsvp',
    title: 'RSVP & Doa Restu',
    description: 'Formulir konfirmasi kehadiran tamu dan ucapan doa restu interaktif.',
    icon: MessageSquare,
  },
  {
    type: 'gift',
    title: 'Tanda Kasih (Wedding Gift)',
    description: 'Nomor rekening bank dengan tombol salin otomatis dan alamat pengiriman kado.',
    icon: Gift,
  },
  {
    type: 'footer',
    title: 'Penutup & Salam Hormat',
    description: 'Ucapan terima kasih keluarga besar mempelai kepada seluruh tamu undangan.',
    icon: CheckCircle,
  },
];

interface EditorAddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditorAddSectionModal: React.FC<EditorAddSectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const addSection = useInvitationEditorStore((s) => s.addSection);

  const handleSelect = (type: SectionType) => {
    addSection(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto" data-testid="editor-add-section-modal">
        <DialogHeader>
          <DialogTitle>Katalog Bagian Undangan (Section Library)</DialogTitle>
          <DialogDescription>
            Pilih komponen bagian yang ingin ditambahkan ke tumpukan undangan pernikahan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {SECTION_CATALOG.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSelect(item.type)}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 text-left transition-all group flex flex-col justify-between"
                data-testid={`catalog-item-${item.type}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-primary font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>+ Tambahkan ke Kanvas</span>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
