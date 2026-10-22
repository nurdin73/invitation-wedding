'use client';

import * as React from 'react';
import type { SectionRenderProps, GiftSectionData } from '../../types';
import { Gift, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const GiftBankCards: React.FC<SectionRenderProps<'gift'>> = ({ data }) => {
  const gift = data as GiftSectionData;
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const accounts = gift.accounts && gift.accounts.length > 0
    ? gift.accounts
    : [
        {
          id: '1',
          bankName: 'Bank Central Asia (BCA)',
          accountNumber: '1234567890',
          accountHolder: 'Romeo Montague',
        },
        {
          id: '2',
          bankName: 'Bank Mandiri',
          accountNumber: '9876543210',
          accountHolder: 'Juliet Capulet',
        },
      ];

  const handleCopy = (accId: string, accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedId(accId);
    toast.success('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      data-testid="section-gift-bank-cards"
      className="relative w-full py-12 px-6 text-center space-y-6"
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
          {gift.title || 'Tanda Kasih (Wedding Gift)'}
        </h2>
        <p className="text-xs opacity-70 max-w-xs mx-auto">
          {gift.subtitle || 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih, dapat disalurkan melalui rekening berikut:'}
        </p>
      </div>

      <div className="space-y-3.5 max-w-sm mx-auto">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-4 rounded-2xl border border-current/10 bg-current/[0.02] text-left space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[var(--inv-primary)]">
                {acc.bankName}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(acc.id, acc.accountNumber)}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border border-current/20 bg-background/60 hover:bg-background transition-colors"
              >
                {copiedId === acc.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin No. Rek</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <p className="font-mono text-sm tracking-wider font-semibold text-foreground">
                {acc.accountNumber}
              </p>
              <p className="text-xs opacity-75">a.n {acc.accountHolder}</p>
            </div>
          </div>
        ))}

        {gift.giftAddress && (
          <div className="p-4 rounded-2xl border border-dashed border-current/20 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--inv-primary)]">
              <Gift className="w-3.5 h-3.5" />
              <span>Kirim Kado Fisik</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">{gift.giftAddress}</p>
            {gift.recipientName && (
              <p className="text-[11px] opacity-70">Penerima: {gift.recipientName} ({gift.recipientPhone || '-'})</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
