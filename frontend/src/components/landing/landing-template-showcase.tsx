'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type TemplateCategory = 'all' | 'minimalist' | 'floral' | 'traditional' | 'luxury';

interface CategoryFilter {
  id: TemplateCategory;
  label: string;
}

interface TemplateShowcaseItem {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryLabel: string;
  badge: string;
  imageSrc: string;
  description: string;
}

const CATEGORIES: readonly CategoryFilter[] = [
  { id: 'all', label: 'Semua Desain' },
  { id: 'minimalist', label: 'Minimalis' },
  { id: 'floral', label: 'Floral Romantis' },
  { id: 'traditional', label: 'Adat & Tradisional' },
  { id: 'luxury', label: 'Modern Mewah' },
] as const;

const TEMPLATES: readonly TemplateShowcaseItem[] = [
  {
    id: 'linen-minimalist',
    name: 'Warm Linen Elegance',
    category: 'minimalist',
    categoryLabel: 'Minimalis',
    badge: 'Terpopuler',
    imageSrc: '/templates/template_minimalist.jpg',
    description: 'Desain bertekstur linen hangat dengan sentuhan ranting botani yang tenang dan bersahaja.',
  },
  {
    id: 'botanica-blush',
    name: 'Botanica Blush Rose',
    category: 'floral',
    categoryLabel: 'Floral Romantis',
    badge: 'Favorit',
    imageSrc: '/templates/template_floral.jpg',
    description: 'Ilustrasi bunga mawar cat air dengan palet warna dusty rose yang lembut dan romantis.',
  },
  {
    id: 'nusantara-heritage',
    name: 'Nusantara Royal Heritage',
    category: 'traditional',
    categoryLabel: 'Adat Tradisional',
    badge: 'Adat Nusantara',
    imageSrc: '/templates/template_traditional.jpg',
    description: 'Nuansa warna espresso arang berhias motif batik emas mewah yang anggun untuk konsep adat.',
  },
  {
    id: 'royale-velvet',
    name: 'Royale Monogram Luxury',
    category: 'luxury',
    categoryLabel: 'Modern Mewah',
    badge: 'Eksklusif',
    imageSrc: '/templates/template_luxury.jpg',
    description: 'Tampilan kartu putih bersih bergaris emas champagne yang memberikan kesan megah dan eksklusif.',
  },
  {
    id: 'spring-blossom',
    name: 'Spring Garden Blossom',
    category: 'floral',
    categoryLabel: 'Floral Romantis',
    badge: 'Baru',
    imageSrc: '/templates/template_floral.jpg',
    description: 'Sentuhan nuansa alam musim semi yang ceria dengan paduan mawar pastel dan dedaunan segar.',
  },
  {
    id: 'pure-minimalist',
    name: 'Pure Warm Paper',
    category: 'minimalist',
    categoryLabel: 'Minimalis',
    badge: 'Minimalis',
    imageSrc: '/templates/template_minimalist.jpg',
    description: 'Gaya tipografi modern di atas kanvas kertas hangat tanpa ornamen berlebih untuk kesan abadi.',
  },
] as const;

export function LandingTemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((tpl) => tpl.category === activeCategory);

  return (
    <section
      id="templates"
      className="py-20 sm:py-28 bg-card-oat/40 border-t border-b border-border transition-colors"
      data-testid="landing-templates-section"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm"
            data-testid="landing-templates-badge"
          >
            Koleksi Desain
          </Badge>

          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground"
            data-testid="landing-templates-title"
          >
            Pilihan Desain{' '}
            <span className="font-serif italic font-normal text-primary">Undangan Pernikahan</span>
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid="landing-templates-subtitle"
          >
            Arahkan kursor pada kartu untuk melihat detail ringkas setiap template.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
          data-testid="landing-template-filter-tabs"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground'
                }`}
                data-testid={`landing-template-tab-${cat.id}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid with Image Background and Bottom-Drawer Hover Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative h-[420px] rounded-3xl overflow-hidden border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              data-testid={`landing-template-card-${template.id}`}
            >
              {/* Full Image Background with Subtle Scale Effect on Hover */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${template.imageSrc})` }}
              />

              {/* Black Tint Overlay (Opacity 0.4 appears when hovered) */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none z-5"
                aria-hidden="true"
              />

              {/* Top Badges (Always Visible) */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-primary border border-border shadow-xs">
                  {template.badge}
                </span>
                <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/10">
                  {template.categoryLabel}
                </span>
              </div>

              {/* Initial Bottom Bar (Visible before Hover) */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                  Template Undangan
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm font-sans">
                  {template.name}
                </h3>
              </div>

              {/* HOVER BOTTOM DRAWER: Only occupies the bottom ~35% of card, keeping background image visible above */}
              <div
                className="absolute bottom-0 inset-x-0 z-20 bg-card/95 backdrop-blur-md p-5 border-t border-border rounded-t-2xl shadow-xl transition-all duration-300 ease-out translate-y-full group-hover:translate-y-0 flex flex-col justify-between"
                data-testid={`landing-template-overlay-${template.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">
                      {template.categoryLabel}
                    </span>
                    <span className="text-[10px] text-muted-caption font-mono">
                      Siap Pakai
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground font-sans tracking-tight">
                    {template.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                {/* Action Button Cluster */}
                <div className="mt-3.5 pt-3 border-t border-border flex items-center gap-2">
                  <Link href="/register" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full gap-1.5 shadow-xs font-semibold text-xs h-8"
                      data-testid={`landing-template-select-${template.id}`}
                    >
                      <span>Pilih Desain</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs"
                      aria-label={`Preview ${template.name}`}
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
