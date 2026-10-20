import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-md space-y-4">
        <span className="text-4xl">💌</span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Undangan Tidak Ditemukan
        </h2>
        <p className="text-sm text-muted-foreground">
          Tautan undangan pernikahan yang Anda tuju belum dipublikasikan atau alamat URL tidak sesuai.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button size="sm">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
