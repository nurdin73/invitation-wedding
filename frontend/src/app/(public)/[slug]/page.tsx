import React from 'react';
import { notFound } from 'next/navigation';
import { publicApi } from '@/services/api/public.api';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { resolveSectionComponent } from '@/modules/invitation-sections/registry';
import type { SectionNode } from '@/modules/invitation-sections/types';

interface GuestPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuestPage({ params }: GuestPageProps) {
  const { slug } = await params;

  let invitation = null;
  try {
    const res = await publicApi.getBySlug(slug);
    invitation = res.data;
  } catch (err) {
    console.warn(`Slug not found [${slug}]:`, err);
  }

  if (!invitation) {
    notFound();
  }

  const canvasStyle = generateCanvasStyleVars(invitation.themeConfig);
  const sections = (Array.isArray(invitation.sections) ? invitation.sections : []) as unknown as SectionNode[];
  const visibleSections = sections.filter((s) => s.isVisible);

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center selection:bg-rose-500 selection:text-white">
      <div className="w-full max-w-md min-h-screen bg-background shadow-2xl relative flex flex-col">
        <main
          style={canvasStyle}
          className="min-h-screen flex flex-col font-sans"
          data-testid="guest-invitation-view"
        >
          {visibleSections.length === 0 ? (
            <div className="my-auto p-12 text-center text-xs opacity-60">
              Undangan pernikahan belum memiliki bagian konten yang dipublikasikan.
            </div>
          ) : (
            visibleSections.map((sec) => {
              const Component = resolveSectionComponent(sec.type, sec.variant);
              return (
                <Component
                  key={sec.id}
                  id={sec.id}
                  data={sec.data}
                  themeConfig={invitation.themeConfig}
                  isEditor={false}
                />
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}
