'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaqItem } from './landing.types';

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'durasi-pembuatan',
    question: 'Berapa lama waktu yang dibutuhkan untuk membuat undangan online?',
    answer:
      'Hanya sekitar 5 hingga 10 menit. Anda cukup memilih template yang diinginkan, melengkapi informasi kedua mempelai, waktu dan lokasi acara, serta mengunggah foto. Undangan akan langsung aktif dan siap dibagikan ke keluarga serta sahabat.',
  },
  {
    id: 'edit-setelah-sebar',
    question: 'Apakah saya masih bisa mengubah data atau foto setelah undangan disebar?',
    answer:
      'Tentu saja bisa. Anda dapat memperbarui informasi acara, rute peta lokasi, mengganti foto galeri, atau menambah nomor rekening kapan saja dari dashboard. Perubahan akan langsung tersimpan dan otomatis tampil pada tautan undangan yang sudah dibagikan.',
  },
  {
    id: 'cara-konfirmasi-tamu',
    question: 'Bagaimana cara tamu undangan mengonfirmasi kehadirannya?',
    answer:
      'Tamu cukup membuka tautan undangan di ponsel mereka, mengisi nama, memilih opsi hadir atau berhalangan, serta menuliskan ucapan selamat dan doa restu. Seluruh rekap kehadiran dan pesan ucapan akan otomatis tercatat rapi di dashboard Anda.',
  },
  {
    id: 'amplop-digital-rekening',
    question: 'Bagaimana cara kerja amplop digital dan pengiriman tanda kasih?',
    answer:
      'Anda dapat mencantumkan nomor rekening bank (seperti BCA, Mandiri, BSI, BRI) maupun dompet digital. Halaman undangan menyediakan tombol "Salin Nomor Rekening" agar tamu dapat menyalin nomor tujuan dengan satu sentuhan dan mentransfer melalui aplikasi perbankan mereka.',
  },
];

export function LandingFaq() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-card-oat/40 border-t border-border"
      data-testid="landing-faq-section"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Sticky Header & WhatsApp Prompt (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="gap-1.5 px-3.5 py-1 text-xs font-medium border-border-soft bg-accent-tint text-primary"
                data-testid="landing-faq-badge"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Pertanyaan Umum</span>
              </Badge>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground font-serif"
                data-testid="landing-faq-title"
              >
                Hal yang Sering Ditanyakan
              </h2>

              <p
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                data-testid="landing-faq-subtitle"
              >
                Informasi lengkap dan transparan seputar pembuatan, pengeditan, dan pengelolaan undangan pernikahan Anda.
              </p>
            </div>

            {/* Micro Support Prompt */}
            <div
              className="rounded-3xl border border-border-soft bg-card p-6 shadow-xs space-y-4"
              data-testid="landing-faq-support-box"
            >
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground font-sans">
                  Masih memiliki pertanyaan?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Tim kami siap memandu Anda mempersiapkan undangan terbaik untuk hari bahagia Anda.
                </p>
              </div>

              <Link
                href="https://wa.me/6281234567890?text=Halo%20Plannikah,%20saya%20ingin%20bertanya%20seputar%20undangan%20online"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 border-primary/30 text-primary hover:bg-accent-tint"
                  data-testid="landing-faq-whatsapp-btn"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Tanya via WhatsApp</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: All Q&A in a Single Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4" data-testid="landing-faq-list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openId === item.id;
              const triggerId = `faq-trigger-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-primary/40 bg-card shadow-xs'
                      : 'border-border bg-card/70 hover:border-primary/30 hover:bg-card'
                  }`}
                  data-testid={`landing-faq-item-${index}`}
                >
                  <button
                    id={triggerId}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    data-testid={`landing-faq-btn-${index}`}
                  >
                    <span className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                      {item.question}
                    </span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                        isOpen
                          ? 'bg-accent-tint text-primary rotate-180'
                          : 'bg-muted text-muted-caption'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-4"
                      data-testid={`landing-faq-panel-${index}`}
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
