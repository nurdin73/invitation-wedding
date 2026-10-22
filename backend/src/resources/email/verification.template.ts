import fs from 'node:fs';
import Handlebars from 'handlebars';
import { env } from '../../configs/env';
import baseLayoutPath from './base-layout.hbs';
import verificationBodyPath from './verification.template.hbs';

import type { UserRole } from '../../db/schema/users.schema';

export interface VerificationEmailContext {
  fullName: string;
  role?: UserRole | 'BRIDE_GROOM';
  verificationUrl: string;
  appName?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

// Read raw HTML templates from file paths
const baseLayoutSource = fs.readFileSync(baseLayoutPath, 'utf8');
const verificationBodySource = fs.readFileSync(verificationBodyPath, 'utf8');

// Pre-compiled Handlebars templates (in-memory for maximum throughput)
const compiledBaseLayout = Handlebars.compile(baseLayoutSource);
const compiledVerificationBody = Handlebars.compile(verificationBodySource);

export function renderVerificationEmail(context: VerificationEmailContext): RenderedEmail {
  const appName = context.appName || env.APP_NAME || 'Wedding Invitation';
  const subject = `Verifikasi Alamat Email Anda - ${appName}`;
  const currentYear = new Date().getFullYear();

  let roleLabel: string | undefined;
  if (context.role === 'CONTRIBUTOR') {
    roleLabel = 'Kontributor Desain';
  } else if (context.role === 'USER' || context.role === 'BRIDE_GROOM') {
    roleLabel = 'Calon Pengantin';
  } else if (context.role === 'ADMIN') {
    roleLabel = 'Administrator';
  }

  const bodyContent = compiledVerificationBody({
    fullName: context.fullName,
    roleLabel,
    verificationUrl: context.verificationUrl,
    appName,
  });

  const html = compiledBaseLayout({
    subject,
    appName,
    currentYear,
    bodyContent,
  });

  const text = `Halo ${context.fullName},\n\nTerima kasih telah mendaftar di ${appName}${
    roleLabel ? ` sebagai ${roleLabel}` : ''
  }.\nSilakan konfirmasi alamat email Anda melalui tautan berikut:\n${
    context.verificationUrl
  }\n\nTautan ini berlaku selama 24 jam.\n\nSalam,\nTim ${appName}`;

  return { subject, html, text };
}
