'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { Sparkles } from 'lucide-react';

export const QuoteForm: React.FC = () => {
  const quote = useInvitationEditorStore((s) => s.content.quote);
  const updateQuote = useInvitationEditorStore((s) => s.updateQuote);

  const presets = [
    {
      title: 'QS. Ar-Rum: 21',
      text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      source: 'QS. Ar-Rum: 21',
    },
    {
      title: '1 Korintus 13:4-7',
      text: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.',
      source: '1 Korintus 13:4-7',
    },
    {
      title: 'Puitis Universal',
      text: 'Dua jiwa yang ditakdirkan bersama, melangkah dalam harmoni cinta, saling melengkapi dan menyempurnakan perjalanan hidup.',
      source: 'Kutipan Kasih',
    },
  ];

  return (
    <div className="space-y-4 text-xs" data-testid="editor-content-quote-form">
      <div>
        <label className="block font-medium mb-1 text-foreground">Isi Kutipan / Ayat Suci</label>
        <textarea
          rows={4}
          value={quote.quoteText}
          onChange={(e) => updateQuote({ ...quote, quoteText: e.target.value })}
          placeholder="Tuliskan ayat suci atau kata-kata mutiara pembuka undangan..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-foreground">Sumber Kutipan / Nama Surat</label>
        <input
          type="text"
          value={quote.sourceText}
          onChange={(e) => updateQuote({ ...quote, sourceText: e.target.value })}
          placeholder="Contoh: QS. Ar-Rum: 21"
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Preset Cepat */}
      <div className="pt-2 border-t border-border">
        <label className="block font-medium mb-2 text-muted-foreground flex items-center gap-1.5 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Gunakan Contoh Kutipan Siap Pakai:</span>
        </label>
        <div className="space-y-2">
          {presets.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => updateQuote({ quoteText: p.text, sourceText: p.source })}
              className="w-full text-left p-2.5 rounded-lg border border-border/80 bg-card/60 hover:bg-card hover:border-primary/50 transition-all text-[11px]"
            >
              <span className="font-semibold text-foreground block mb-0.5">{p.title}</span>
              <p className="text-muted-foreground line-clamp-2 leading-tight">{p.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
