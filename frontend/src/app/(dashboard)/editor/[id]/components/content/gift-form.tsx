'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { CreditCard, Plus, Trash2, Gift } from 'lucide-react';
import type { BankAccountItem } from '@/modules/invitation-sections/types';
import { Button } from '@/components/ui/button';

const POPULAR_BANKS = ['BCA', 'Mandiri', 'BRI', 'BNI', 'BSI', 'CIMB Niaga', 'Bank Jago', 'Jenius', 'GoPay', 'OVO', 'DANA'];

export const GiftForm: React.FC = () => {
  const gift = useInvitationEditorStore((s) => s.content.gift);
  const updateGift = useInvitationEditorStore((s) => s.updateGift);

  const handleAddAccount = () => {
    const newAccount: BankAccountItem = {
      id: `acc-${Date.now().toString(36)}`,
      bankName: 'BCA',
      accountNumber: '',
      accountHolder: '',
    };
    updateGift({
      ...gift,
      accounts: [...gift.accounts, newAccount],
    });
  };

  const handleUpdateAccount = (id: string, patch: Partial<BankAccountItem>) => {
    updateGift({
      ...gift,
      accounts: gift.accounts.map((acc) => (acc.id === id ? { ...acc, ...patch } : acc)),
    });
  };

  const handleDeleteAccount = (id: string) => {
    updateGift({
      ...gift,
      accounts: gift.accounts.filter((acc) => acc.id !== id),
    });
  };

  return (
    <div className="space-y-6 text-xs" data-testid="editor-content-gift-form">
      {/* Daftar Rekening Bank / Dompet Digital */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Rekening Bank / E-Wallet</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAccount}
            className="text-xs gap-1.5 h-7"
            data-testid="add-bank-account-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rekening</span>
          </Button>
        </div>

        {gift.accounts.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border text-center text-muted-foreground opacity-70">
            <p>Belum ada rekening atau dompet digital yang ditambahkan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gift.accounts.map((acc, idx) => (
              <div
                key={acc.id}
                className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <span className="font-semibold text-[11px] text-primary">
                    Rekening #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors text-xs"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                      Nama Bank / Platform
                    </label>
                    <input
                      type="text"
                      list={`banks-list-${acc.id}`}
                      value={acc.bankName}
                      onChange={(e) => handleUpdateAccount(acc.id, { bankName: e.target.value })}
                      placeholder="Contoh: BCA / Mandiri / GoPay"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <datalist id={`banks-list-${acc.id}`}>
                      {POPULAR_BANKS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={acc.accountNumber}
                      onChange={(e) => handleUpdateAccount(acc.id, { accountNumber: e.target.value })}
                      placeholder="1234567890"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                    Atas Nama (Pemilik Rekening)
                  </label>
                  <input
                    type="text"
                    value={acc.accountHolder}
                    onChange={(e) => handleUpdateAccount(acc.id, { accountHolder: e.target.value })}
                    placeholder="Nama sesuai buku tabungan"
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alamat Pengiriman Kado Fisik */}
      <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
        <label className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border pb-2">
          <Gift className="w-4 h-4 text-primary" />
          <span>Alamat Pengiriman Kado Fisik (Opsional)</span>
        </label>

        <div>
          <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
            Alamat Lengkap Penerima
          </label>
          <textarea
            rows={2}
            value={gift.giftAddress || ''}
            onChange={(e) => updateGift({ ...gift, giftAddress: e.target.value })}
            placeholder="Jl. Melati No. 12, Kelurahan ..., Kecamatan ..., Kota ..., Kode Pos ..."
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Nama Penerima
            </label>
            <input
              type="text"
              value={gift.recipientName || ''}
              onChange={(e) => updateGift({ ...gift, recipientName: e.target.value })}
              placeholder="Romeo & Juliet"
              className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="tel"
              value={gift.recipientPhone || ''}
              onChange={(e) => updateGift({ ...gift, recipientPhone: e.target.value })}
              placeholder="08123456789"
              className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
