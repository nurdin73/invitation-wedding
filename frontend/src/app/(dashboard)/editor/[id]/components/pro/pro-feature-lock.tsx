'use client';

import * as React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';

interface ProFeatureLockProps {
  featureName: string;
  description: string;
  perks?: string[];
  children?: React.ReactNode;
}

export const ProFeatureLock: React.FC<ProFeatureLockProps> = ({
  featureName,
  description,
  perks = [
    'Aktifkan pemutar musik latar otomatis',
    'Terima amplop & kado digital via Bank / QRIS',
    'Tampilkan linimasa kisah cinta',
    'Unggah hingga 15 foto galeri beresolusi tinggi',
  ],
  children,
}) => {
  const setUpgradeModalOpen = useInvitationEditorStore((s) => s.setUpgradeModalOpen);

  return (
    <div
      className="rounded-xl border border-[#DFB15B]/40 bg-linear-to-b from-[#DFB15B]/10 via-card to-card p-5 space-y-4 relative overflow-hidden"
      data-testid={`pro-feature-lock-${featureName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DFB15B]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Fitur Eksklusif PRO</span>
        </div>

        <h4 className="font-semibold text-sm text-foreground">
          {featureName}
        </h4>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Perks Checklist */}
      {perks.length > 0 && (
        <div className="space-y-1.5 py-2 border-y border-border/60">
          <p className="text-[11px] font-semibold text-foreground">
            Keuntungan Paket PRO:
          </p>
          <ul className="space-y-1 text-[11px] text-muted-foreground">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <div className="pt-1">
        <Button
          type="button"
          size="sm"
          onClick={() => setUpgradeModalOpen(true)}
          className="w-full gap-1.5 text-xs font-semibold bg-[#B86B70] hover:bg-[#A3595E] text-white shadow-xs"
          data-testid="pro-feature-upgrade-cta-btn"
        >
          <span>Upgrade ke Paket PRO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-1.5">
          Sekali bayar Rp 149.000 untuk seluruh fitur eksklusif tanpa batasan.
        </p>
      </div>

      {/* Optional Preview Children (rendered in disabled/subtle mode) */}
      {children && (
        <div className="opacity-40 pointer-events-none filter grayscale-50 pt-3 border-t border-dashed border-border">
          {children}
        </div>
      )}
    </div>
  );
};
