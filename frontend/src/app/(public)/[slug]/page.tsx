import React from 'react';
import { notFound } from 'next/navigation';
import { publicApi } from '@/services/api/public.api';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { siteConfig } from '@/config/site';

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

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-amber-500 selection:text-white">
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col">
        <div
          style={canvasStyle}
          className="min-h-screen flex flex-col justify-between p-6 text-center"
          data-testid="guest-invitation-view"
        >
          <div className="my-auto space-y-6">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">
              The Wedding Celebration of
            </span>

            <h1
              className="text-4xl font-bold tracking-tight"
              style={{
                fontFamily: 'var(--inv-font-heading)',
                color: 'var(--inv-primary)',
              }}
            >
              {invitation.title}
            </h1>

            <div className="h-0.5 w-16 mx-auto bg-amber-500/40 rounded-full my-4" />

            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
              berkenan hadir untuk memberikan doa restu.
            </p>
          </div>

          <div className="py-6 border-t border-slate-100 text-xs text-slate-400">
            Dibuat dengan cinta via {siteConfig.name}
          </div>
        </div>
      </div>
    </div>
  );
}
