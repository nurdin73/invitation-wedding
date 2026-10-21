import React from 'react';
import { AuthHeroBanner } from '@/components/auth/auth-hero-banner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full flex flex-col md:flex-row bg-background"
      data-testid="auth-layout"
    >
      {/* Left Column: Full-Height Edge-to-Edge Visual Hero Banner */}
      <section
        className="relative w-full md:w-1/2 lg:w-5/12 xl:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border"
        aria-label="Informasi Platform"
      >
        <AuthHeroBanner />
      </section>

      {/* Right Column: Full-Height Auth Form Area with Clear Separation */}
      <section
        className="w-full md:w-1/2 lg:w-7/12 xl:w-1/2 flex flex-col justify-center items-center px-4 py-10 sm:px-8 sm:py-14 md:px-10 lg:px-16 xl:px-24 bg-background min-h-[500px] md:min-h-screen"
        aria-label="Formulir Autentikasi"
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </section>
    </main>
  );
}
