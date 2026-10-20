import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { IUserRepository } from '../../outbound/user-repository.port';
import type { ISmtpPort } from '../../outbound/smtp.port';
import type { AuthResult, IAuthService, LoginDTO, RegisterDTO } from '../auth.service';

export class AuthServiceImplement implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly smtpPort: ISmtpPort
  ) {}

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
    });

    // Kirim notifikasi selamat datang via SMTP (non-blocking)
    this.smtpPort
      .sendMail({
        to: user.email,
        subject: 'Selamat Datang di Undangan Pernikahan Digital',
        html: `<h2>Halo ${user.fullName},</h2><p>Akun Anda berhasil dibuat. Silakan mulai buat undangan pernikahan impian Anda!</p>`,
      })
      .catch((err) => console.warn('Gagal mengirim email sambutan:', err));

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
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
        createdAt: user.createdAt,
      },
      token: `dummy_jwt_${user.id}`,
    };
  }

  async getProfile(userId: string): Promise<AuthResult['user']> {
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
      createdAt: user.createdAt,
    };
  }
}
