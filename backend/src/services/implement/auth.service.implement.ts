import crypto from 'node:crypto';
import { env } from '../../configs/env';
import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IUserRepository } from '../../outbound/user-repository.port';
import type { IAuthTokenRepository } from '../../outbound/auth-token-repository.port';
import type { ISmtpPort } from '../../outbound/smtp.port';
import type {
  AuthResult,
  ForgotPasswordDTO,
  IAuthService,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  UserProfileDTO,
  VerifyEmailConfirmDTO,
} from '../auth.service';

export class AuthServiceImplement implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authTokenRepo: IAuthTokenRepository,
    private readonly smtpPort: ISmtpPort
  ) {}

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private generateRawToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(payload: RegisterDTO): Promise<AuthResult> {
    const existing = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    if (existing) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        'Alamat email sudah terdaftar dalam sistem.',
        409
      );
    }

    const passwordHash = await Bun.password.hash(payload.password, {
      algorithm: 'argon2id',
      memoryCost: 65536,
      timeCost: 3,
    });

    const user = await this.userRepo.create({
      email: payload.email.toLowerCase().trim(),
      fullName: payload.fullName.trim(),
      passwordHash,
      role: payload.role || 'USER',
      isEmailVerified: false,
      emailVerifiedAt: null,
    });

    // Buat token verifikasi email berbatas waktu 24 jam
    const rawVerificationToken = this.generateRawToken();
    const tokenHash = this.hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.authTokenRepo.createToken({
      userId: user.id,
      tokenHash,
      type: 'EMAIL_VERIFICATION',
      expiresAt,
    });

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;

    // Kirim email sambutan & verifikasi via SMTP (non-blocking)
    this.smtpPort
      .sendMail({
        to: user.email,
        subject: `Verifikasi Alamat Email Anda - ${env.APP_NAME}`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #ECE5DE; border-radius: 16px; background-color: #FAF8F5;">
            <h2 style="color: #3A302C; margin-bottom: 12px;">Halo ${user.fullName},</h2>
            <p style="color: #73635C; line-height: 1.6; font-size: 14px;">
              Terima kasih telah bergabung di <strong>${env.APP_NAME}</strong> sebagai <em>${user.role === 'CONTRIBUTOR' ? 'Kontributor Desain' : 'Calon Pengantin'}</em>.
              Silakan konfirmasi alamat email Anda untuk mengamankan akun dan menikmati seluruh fitur.
            </p>
            <div style="margin: 24px 0;">
              <a href="${verificationUrl}" style="background-color: #B86B70; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; display: inline-block;">
                Verifikasi Email Saya
              </a>
            </div>
            <p style="color: #A89B95; font-size: 12px; margin-top: 24px;">
              Tautan ini berlaku selama 24 jam. Jika Anda tidak pernah mendaftar, abaikan email ini.
            </p>
          </div>
        `,
      })
      .catch((err) => console.warn('Gagal mengirim email verifikasi registrasi:', err));

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
      token: `dummy_jwt_${user.id}`, // Route decorator will handle real signed JWT
    };
  }

  async login(payload: LoginDTO): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    if (!user) {
      throw new AppDomainError(
        META_CODES.INVALID_CREDENTIALS,
        'Kombinasi email atau kata sandi tidak valid.',
        401
      );
    }

    const isMatch = await Bun.password.verify(payload.password, user.passwordHash);
    if (!isMatch) {
      throw new AppDomainError(
        META_CODES.INVALID_CREDENTIALS,
        'Kombinasi email atau kata sandi tidak valid.',
        401
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
      token: `dummy_jwt_${user.id}`,
    };
  }

  async getProfile(userId: string): Promise<UserProfileDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppDomainError(
        META_CODES.ACCOUNT_NOT_FOUND,
        'Pengguna tidak ditemukan dalam sistem.',
        404
      );
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    };
  }

  async logout(_userId: string): Promise<void> {
    // Stateless token completion. Route handler clears session cookies.
  }

  async requestPasswordReset(payload: ForgotPasswordDTO): Promise<void> {
    const user = await this.userRepo.findByEmail(payload.email.toLowerCase().trim());
    // Mencegah user enumeration: jika user tidak ada, return tanpa error
    if (!user) return;

    await this.authTokenRepo.invalidateExistingTokens(user.id, 'PASSWORD_RESET');

    const rawToken = this.generateRawToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await this.authTokenRepo.createToken({
      userId: user.id,
      tokenHash,
      type: 'PASSWORD_RESET',
      expiresAt,
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    this.smtpPort
      .sendMail({
        to: user.email,
        subject: `Permintaan Atur Ulang Kata Sandi - ${env.APP_NAME}`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #ECE5DE; border-radius: 16px; background-color: #FAF8F5;">
            <h2 style="color: #3A302C; margin-bottom: 12px;">Halo ${user.fullName},</h2>
            <p style="color: #73635C; line-height: 1.6; font-size: 14px;">
              Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Klik tombol di bawah ini untuk membuat kata sandi baru yang aman:
            </p>
            <div style="margin: 24px 0;">
              <a href="${resetUrl}" style="background-color: #B86B70; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; display: inline-block;">
                Atur Ulang Kata Sandi
              </a>
            </div>
            <p style="color: #A89B95; font-size: 12px; margin-top: 24px;">
              Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak pernah meminta perubahan ini, akun Anda tetap aman dan abaikan pesan ini.
            </p>
          </div>
        `,
      })
      .catch((err) => console.warn('Gagal mengirim email reset password:', err));
  }

  async resetPassword(payload: ResetPasswordDTO): Promise<void> {
    const tokenHash = this.hashToken(payload.token);
    const tokenRecord = await this.authTokenRepo.findValidToken(tokenHash, 'PASSWORD_RESET');

    if (!tokenRecord) {
      throw new AppDomainError(
        META_CODES.TOKEN_EXPIRED,
        'Tautan reset kata sandi tidak valid atau telah kedaluwarsa.',
        400
      );
    }

    const passwordHash = await Bun.password.hash(payload.newPassword, {
      algorithm: 'argon2id',
      memoryCost: 65536,
      timeCost: 3,
    });

    await this.userRepo.update(tokenRecord.userId, { passwordHash });
    await this.authTokenRepo.markAsUsed(tokenRecord.id);
  }

  async sendEmailVerification(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppDomainError(
        META_CODES.ACCOUNT_NOT_FOUND,
        'Pengguna tidak ditemukan dalam sistem.',
        404
      );
    }

    if (user.isEmailVerified) {
      throw new AppDomainError(
        META_CODES.SCHEMA_VALIDATION_ERROR,
        'Alamat email Anda sudah terverifikasi sebelumnya.',
        400
      );
    }

    await this.authTokenRepo.invalidateExistingTokens(user.id, 'EMAIL_VERIFICATION');

    const rawToken = this.generateRawToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    await this.authTokenRepo.createToken({
      userId: user.id,
      tokenHash,
      type: 'EMAIL_VERIFICATION',
      expiresAt,
    });

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    await this.smtpPort.sendMail({
      to: user.email,
      subject: `Verifikasi Alamat Email Anda - ${env.APP_NAME}`,
      html: `
        <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #ECE5DE; border-radius: 16px; background-color: #FAF8F5;">
          <h2 style="color: #3A302C; margin-bottom: 12px;">Halo ${user.fullName},</h2>
          <p style="color: #73635C; line-height: 1.6; font-size: 14px;">
            Berikut adalah tautan verifikasi alamat email untuk akun <strong>${env.APP_NAME}</strong> Anda:
          </p>
          <div style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background-color: #B86B70; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; display: inline-block;">
              Konfirmasi Email Saya
            </a>
          </div>
          <p style="color: #A89B95; font-size: 12px; margin-top: 24px;">
            Tautan ini berlaku selama 24 jam.
          </p>
        </div>
      `,
    });
  }

  async verifyEmail(payload: VerifyEmailConfirmDTO): Promise<void> {
    const tokenHash = this.hashToken(payload.token);
    const tokenRecord = await this.authTokenRepo.findValidToken(tokenHash, 'EMAIL_VERIFICATION');

    if (!tokenRecord) {
      throw new AppDomainError(
        META_CODES.TOKEN_EXPIRED,
        'Tautan verifikasi email tidak valid atau telah kedaluwarsa.',
        400
      );
    }

    await this.userRepo.update(tokenRecord.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await this.authTokenRepo.markAsUsed(tokenRecord.id);
  }
}
