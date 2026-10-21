import { type ZodType } from 'zod';

/**
 * Adapter murni untuk menghubungkan skema validasi Zod ke prop `validate` pada Formik.
 * Mengonversi issue Zod menjadi dictionary errors { [path]: message } tanpa dependensi tambahan.
 */
export function validateWithZod<T extends Record<string, unknown>>(schema: ZodType<T>) {
  return (values: unknown): Record<string, string> | undefined => {
    const result = schema.safeParse(values);
    if (result.success) {
      return undefined;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const fieldPath = issue.path.join('.');
      if (fieldPath && !errors[fieldPath]) {
        errors[fieldPath] = issue.message;
      }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  };
}
