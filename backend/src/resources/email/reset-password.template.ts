import fs from 'node:fs';
import Handlebars from 'handlebars';
import { env } from '../../configs/env';
import baseLayoutPath from './base-layout.hbs';
import resetPasswordBodyPath from './reset-password.template.hbs';
import type { RenderedEmail } from './verification.template';

export interface ResetPasswordEmailContext {
  fullName: string;
  resetUrl: string;
  appName?: string;
  expiresIn?: string;
}

// Read raw HTML templates from file paths
const baseLayoutSource = fs.readFileSync(baseLayoutPath, 'utf8');
const resetPasswordBodySource = fs.readFileSync(resetPasswordBodyPath, 'utf8');

// Pre-compiled Handlebars templates
const compiledBaseLayout = Handlebars.compile(baseLayoutSource);
const compiledResetPasswordBody = Handlebars.compile(resetPasswordBodySource);

export function renderResetPasswordEmail(context: ResetPasswordEmailContext): RenderedEmail {
  const appName = context.appName || env.APP_NAME || 'Wedding Invitation';
  const subject = `Permintaan Atur Ulang Kata Sandi - ${appName}`;
  const currentYear = new Date().getFullYear();
  const expiresIn = context.expiresIn || '1 jam';

  const bodyContent = compiledResetPasswordBody({
    fullName: context.fullName,
    resetUrl: context.resetUrl,
    appName,
    expiresIn,
  });

  const html = compiledBaseLayout({
    subject,
    appName,
    currentYear,
    bodyContent,
  });

  const text = `Halo ${context.fullName},\n\nKami menerima permintaan untuk mengatur ulang kata sandi akun Anda di ${appName}.\nSilakan klik tautan berikut untuk membuat kata sandi baru:\n${
    context.resetUrl
  }\n\nTautan ini hanya berlaku selama ${expiresIn}.\nJika Anda tidak pernah meminta ini, abaikan pesan ini.\n\nSalam,\nTim ${appName}`;

  return { subject, html, text };
}
