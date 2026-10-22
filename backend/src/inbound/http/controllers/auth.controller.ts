import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type {
  ForgotPasswordDTO,
  IAuthService,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  VerifyEmailConfirmDTO,
} from '../../../services/auth.service';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async register(payload: RegisterDTO) {
    const result = await this.authService.register(payload);
    return ResponseHelper.success(
      result,
      'Registrasi berhasil dilakukan.',
      META_CODES.RESOURCE_CREATED
    );
  }

  async login(payload: LoginDTO) {
    const result = await this.authService.login(payload);
    return ResponseHelper.success(
      result,
      'Login berhasil.',
      META_CODES.SUCCESS_OK
    );
  }

  async getProfile(userId: string) {
    const result = await this.authService.getProfile(userId);
    return ResponseHelper.success(
      result,
      'Data profil berhasil diambil.',
      META_CODES.SUCCESS_OK
    );
  }

  async logout(userId: string) {
    await this.authService.logout(userId);
    return ResponseHelper.success(
      null,
      'Sesi berhasil diakhiri.',
      META_CODES.SUCCESS_OK
    );
  }

  async forgotPassword(payload: ForgotPasswordDTO) {
    await this.authService.requestPasswordReset(payload);
    return ResponseHelper.success(
      null,
      'Instruksi pemulihan telah dikirim jika email terdaftar.',
      META_CODES.SUCCESS_OK
    );
  }

  async resetPassword(payload: ResetPasswordDTO) {
    await this.authService.resetPassword(payload);
    return ResponseHelper.success(
      null,
      'Kata sandi berhasil diperbarui.',
      META_CODES.SUCCESS_OK
    );
  }

  async sendEmailVerification(userId: string) {
    await this.authService.sendEmailVerification(userId);
    return ResponseHelper.success(
      null,
      'Email verifikasi berhasil dikirimkan.',
      META_CODES.SUCCESS_OK
    );
  }

  async verifyEmail(payload: VerifyEmailConfirmDTO) {
    await this.authService.verifyEmail(payload);
    return ResponseHelper.success(
      null,
      'Alamat email berhasil diverifikasi.',
      META_CODES.SUCCESS_OK
    );
  }
}
