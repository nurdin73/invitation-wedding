'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Share2, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GuestLinkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  title: string;
}

export const GuestLinkGeneratorModal: React.FC<GuestLinkGeneratorModalProps> = ({
  isOpen,
  onClose,
  slug,
  title,
}) => {
  const [guestName, setGuestName] = React.useState('');
  const [hasCopiedLink, setHasCopiedLink] = React.useState(false);
  const [hasCopiedMessage, setHasCopiedMessage] = React.useState(false);

  const [origin, setOrigin] = React.useState('');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const cleanGuestName = guestName.trim();
  const guestQueryParam = cleanGuestName ? `?to=${encodeURIComponent(cleanGuestName)}` : '';
  const fullInvitationUrl = `${origin}/${slug}${guestQueryParam}`;

  const defaultGreeting = cleanGuestName || 'Bapak/Ibu/Saudara/i';
  const whatsappTemplate = `Kepada Yth. ${defaultGreeting},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada acara pernikahan kami:
*${title}*

Informasi lengkap mengenai waktu, lokasi acara, dan konfirmasi kehadiran dapat dilihat melalui tautan undangan berikut:
${fullInvitationUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullInvitationUrl);
      setHasCopiedLink(true);
      toast.success('Tautan undangan personal berhasil disalin ke clipboard!');
      setTimeout(() => setHasCopiedLink(false), 2500);
    } catch {
      toast.error('Gagal menyalin tautan ke clipboard.');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappTemplate);
      setHasCopiedMessage(true);
      toast.success('Template pesan WhatsApp berhasil disalin!');
      setTimeout(() => setHasCopiedMessage(false), 2500);
    } catch {
      toast.error('Gagal menyalin pesan WhatsApp.');
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappTemplate)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md w-full p-6 space-y-4"
        data-testid="guest-link-generator-modal"
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary shrink-0" />
            <span>Bagikan Undangan Personal</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Buat tautan personal dengan nama tamu yang akan tampil elegan di cover pembuka undangan.
          </DialogDescription>
        </DialogHeader>

        {/* Form Input Nama Tamu */}
        <div className="space-y-2">
          <Label htmlFor="guest-name-input" className="text-xs font-semibold text-foreground">
            Nama Tamu / Keluarga yang Diundang
          </Label>
          <Input
            id="guest-name-input"
            type="text"
            placeholder="Contoh: Bapak Budi Santoso & Keluarga"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="text-xs h-9"
            data-testid="guest-name-input"
          />
          <p className="text-[11px] text-muted-foreground">
            Nama di atas akan otomatis disematkan pada parameter URL <code className="font-mono bg-muted/60 px-1 py-0.5 rounded text-[10px]">?to=...</code>
          </p>
        </div>

        {/* Preview Link Box */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Tautan Undangan Tamu
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 bg-card-oat/50 border border-border rounded-lg px-3 py-2 text-[11px] font-mono text-foreground truncate select-all">
              {fullInvitationUrl}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0 text-xs gap-1.5 h-9"
              data-testid="guest-link-copy-btn"
            >
              {hasCopiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedLink ? 'Tersalin' : 'Salin'}</span>
            </Button>
          </div>
        </div>

        {/* WhatsApp Template Card */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Template Pesan WhatsApp</span>
            </Label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              {hasCopiedMessage ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              <span>{hasCopiedMessage ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>

          <div className="bg-card-oat/40 border border-border/80 rounded-lg p-3 text-[11px] text-foreground leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto font-sans select-text">
            {whatsappTemplate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Tutup
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleOpenWhatsApp}
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            data-testid="guest-link-whatsapp-btn"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Kirim via WhatsApp</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
