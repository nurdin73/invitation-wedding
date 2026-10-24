'use client';

import * as React from 'react';
import type { SectionRenderProps, BankAccountItem } from '../../types';
import { Gift, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const GiftBankCards: React.FC<SectionRenderProps<'gift'>> = ({
  content,
  copy,
  isEditor,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const accounts = (content?.gift?.accounts && content.gift.accounts.length > 0)
    ? content.gift.accounts
    : (isEditor
        ? [
            {
              id: 'sample-bank-1',
              bankName: 'Bank Central Asia (BCA)',
              accountNumber: '1234567890',
              accountHolder: 'Nama Pemilik Rekening',
            },
          ]
        : []);

  const giftAddress = content?.gift?.giftAddress;
  const recipientName = content?.gift?.recipientName;
  const recipientPhone = content?.gift?.recipientPhone;

  const handleCopy = (accId: string, accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedId(accId);
    toast.success('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      data-testid="section-gift-bank-cards"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 sm:space-y-8 flex flex-col justify-center items-center"
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
          {copy?.title || 'Tanda Kasih (Wedding Gift)'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle ||
            'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih, dapat disalurkan melalui rekening berikut:'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto pt-2 sm:pt-4 space-y-4 sm:space-y-6">
        <div className="inv-grid-2-cols gap-4 sm:gap-6">
          {accounts.map((acc: BankAccountItem) => (
            <div
              key={acc.id}
              className="relative overflow-hidden p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-gradient-to-br from-white/80 via-white/50 to-white/70 dark:from-white/[0.08] dark:to-white/[0.02] backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300 text-left space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-[var(--inv-primary)]">
                  {acc.bankName}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(acc.id, acc.accountNumber)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[var(--inv-primary)]/30 bg-white/70 dark:bg-black/40 hover:bg-[var(--inv-primary)] hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  {copiedId === acc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success-foreground" />
                      <span className="text-success-foreground font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin No. Rek</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-base sm:text-xl tracking-widest font-bold text-foreground">
                  {acc.accountNumber}
                </p>
                <p className="text-xs sm:text-sm opacity-80 pt-0.5">
                  a.n <span className="font-semibold text-foreground">{acc.accountHolder}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {giftAddress && (
          <div className="p-6 sm:p-7 rounded-3xl border border-dashed border-[var(--inv-primary)]/30 bg-white/40 dark:bg-black/20 backdrop-blur-md text-left space-y-2 max-w-2xl mx-auto shadow-xs">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--inv-primary)]">
              <Gift className="w-4 h-4" />
              <span>Kirim Kado Fisik</span>
            </div>
            <p className="text-xs sm:text-sm opacity-85 leading-relaxed">{giftAddress}</p>
            {recipientName && (
              <p className="text-xs opacity-75 pt-1">
                Penerima: <span className="font-medium text-foreground">{recipientName}</span> ({recipientPhone || '-'})
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
