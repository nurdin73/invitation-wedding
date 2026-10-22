import React from 'react';
import { notFound } from 'next/navigation';
import { publicApi } from '@/services/api/public.api';
import { PublicInvitationContainer } from './components/public-invitation-container';

interface GuestPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; u?: string }>;
}

export default async function GuestPage({ params, searchParams }: GuestPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const guestName = query.to || query.u || '';

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

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center selection:bg-rose-500 selection:text-white">
      <PublicInvitationContainer
        invitation={invitation}
        guestName={guestName}
      />
    </div>
  );
}
