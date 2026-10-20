import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { IAuthService, LoginDTO, RegisterDTO } from '../../../services/auth.service';

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
}
