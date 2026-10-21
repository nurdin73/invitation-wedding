import Link from 'next/link';
import { Sparkles, MessageCircle, Mail, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';

function InstagramIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface FooterLinkItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

interface FooterSection {
  readonly title: string;
  readonly links: readonly FooterLinkItem[];
}

const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    title: 'Produk',
    links: [
      { label: 'Fitur Utama', href: '#features' },
      { label: 'Cara Membuat', href: '#how-it-works' },
      { label: 'Koleksi Template', href: '#templates' },
      { label: 'Harga & Paket', href: '#pricing' },
      { label: 'Tanya Jawab (FAQ)', href: '#faq' },
    ],
  },
  {
    title: 'Koleksi Desain',
    links: [
      { label: 'Minimalis Elegan', href: '#templates' },
      { label: 'Floral Romantis', href: '#templates' },
      { label: 'Adat Nusantara', href: '#templates' },
      { label: 'Modern Mewah', href: '#templates' },
    ],
  },
  {
    title: 'Dukungan & Legal',
    links: [
      {
        label: 'Bantuan via WhatsApp',
        href: 'https://wa.me/6281234567890?text=Halo%20Plannikah,%20saya%20butuh%20bantuan',
        isExternal: true,
      },
      { label: 'Syarat & Ketentuan', href: '/terms' },
      { label: 'Kebijakan Privasi', href: '/privacy' },
    ],
  },
];

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-border bg-card-oat/50 text-foreground"
      data-testid="landing-footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 inline-flex"
              data-testid="landing-footer-logo"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-bold tracking-tight text-foreground">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
                  Wedding Studio
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform undangan pernikahan digital modern yang anggun, cepat dibuka, dan mudah dibagikan. Membantu calon pengantin menyambut hari bahagia dengan tenang.
            </p>

            {/* Social & Contact Icons */}
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Plannikah"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent-tint hover:text-primary transition-colors"
                data-testid="landing-footer-social-whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Plannikah"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent-tint hover:text-primary transition-colors"
                data-testid="landing-footer-social-instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:halo@plannikah.com"
                aria-label="Email Plannikah"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent-tint hover:text-primary transition-colors"
                data-testid="landing-footer-social-email"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Navigation Links Columns (8 cols total, 3 sections) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-3.5">
                <h4 className="text-sm font-semibold text-foreground font-sans tracking-tight">
                  {section.title}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        target={link.isExternal ? '_blank' : undefined}
                        rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        className="text-muted-foreground hover:text-primary transition-colors inline-block"
                        data-testid={`landing-footer-link-${idx}-${linkIdx}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-sans">
          <p>© {currentYear} {siteConfig.name}. Seluruh hak cipta dilindungi undang-undang.</p>

          <div className="flex items-center gap-1.5 text-muted-caption">
            <span>Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-label="cinta" />
            <span>untuk hari bahagia calon pengantin di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
