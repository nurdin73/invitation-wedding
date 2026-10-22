import { z } from 'zod';

/**
 * Skema validasi kompleksitas kata sandi terstandarisasi:
 * - Minimal 8 karakter
 * - Minimal 1 huruf kecil [a-z]
 * - Minimal 1 huruf besar [A-Z]
 * - Minimal 1 angka [0-9]
 * - Minimal 1 karakter khusus / simbol [^a-zA-Z0-9]
 */
export const passwordComplexitySchema = z
  .string()
  .min(1, 'Kata sandi wajib diisi.')
  .min(8, 'Kata sandi minimal 8 karakter.')
  .regex(/[a-z]/, 'Kata sandi harus mengandung minimal 1 huruf kecil.')
  .regex(/[A-Z]/, 'Kata sandi harus mengandung minimal 1 huruf besar.')
  .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka.')
  .regex(/[^a-zA-Z0-9]/, 'Kata sandi harus mengandung minimal 1 karakter khusus / simbol (misal: !@#$%^&*).');
