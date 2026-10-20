export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_random_salt_at_least_64_characters_long_for_security_compliance',
  ARGON2_PEPPER: process.env.ARGON2_PEPPER || '',

  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5433/wedding_saas',

  // Object Storage (MinIO Local / Cloudflare R2)
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || 'local-minio',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || 'minioadmin',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || 'minioadminpassword',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || 'wedding-invitations-media',
  R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN || 'http://localhost:9000/wedding-invitations-media',
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE === 'true',

  // Midtrans Payment Gateway
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-mock',
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-mock',
  MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION === 'true',

  // SMTP Mailer
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '1025', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@undangan.local',
} as const;
