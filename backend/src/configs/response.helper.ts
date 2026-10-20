import { META_CODES, type MetaCode } from '../constants/meta-codes';

export interface ApiResponse<T = unknown> {
  meta: {
    code: number;
    timestamp: string;
    requestId?: string;
  };
  status: 'OK' | 'FAILED';
  message: string;
  data: T | null;
  errors?: unknown;
}

export class AppDomainError extends Error {
  constructor(
    public readonly metaCode: MetaCode,
    message: string,
    public readonly statusCode: number = 400,
    public readonly errors?: unknown
  ) {
    super(message);
    this.name = 'AppDomainError';
  }
}

export class ResponseHelper {
  static success<T>(
    data: T,
    message: string = 'Operasi berhasil dilakukan.',
    customCode: MetaCode = META_CODES.SUCCESS_OK,
    requestId?: string
  ): ApiResponse<T> {
    return {
      meta: {
        code: customCode,
        timestamp: new Date().toISOString(),
        ...(requestId ? { requestId } : {}),
      },
      status: 'OK',
      message,
      data,
    };
  }

  static failed(
    message: string,
    customCode: MetaCode = META_CODES.INTERNAL_SERVER_ERROR,
    errors?: unknown,
    requestId?: string
  ): ApiResponse<null> {
    return {
      meta: {
        code: customCode,
        timestamp: new Date().toISOString(),
        ...(requestId ? { requestId } : {}),
      },
      status: 'FAILED',
      message,
      data: null,
      ...(errors ? { errors } : {}),
    };
  }
}
