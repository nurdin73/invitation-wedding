import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Undangan Pernikahan
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform pembuatan undangan online modern & interaktif
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
