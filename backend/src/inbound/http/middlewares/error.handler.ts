import { Elysia } from 'elysia';
import { AppDomainError, ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';

export const errorHandler = new Elysia({ name: 'error-handler' }).onError(
  ({ code, error, set }) => {
    // 1. Tangani domain exception kustom (AppDomainError)
    if (error instanceof AppDomainError) {
      set.status = error.statusCode;
      return ResponseHelper.failed(error.message, error.metaCode, error.errors);
    }

    // 2. Tangani kesalahan validasi skema Elysia / TypeBox
    if (code === 'VALIDATION') {
      set.status = 422;
      return ResponseHelper.failed(
        'Format data masukan tidak sesuai dengan skema yang ditentukan.',
        META_CODES.SCHEMA_VALIDATION_ERROR,
        error.message
      );
    }

    // 3. Tangani route / resource tidak ditemukan
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return ResponseHelper.failed(
        'Endpoint atau resource yang diminta tidak ditemukan.',
        META_CODES.RESOURCE_NOT_FOUND
      );
    }

    // 4. Fallback server error (500)
    console.error('Unhandled Server Exception:', error);
    set.status = 500;
    return ResponseHelper.failed(
      'Terjadi kesalahan internal pada server.',
      META_CODES.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : String(error)
        : undefined
    );
  }
);
