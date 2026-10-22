import type { UserRole } from '../db/schema/users.schema';

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface VerifyEmailConfirmDTO {
  token: string;
}

export interface UserProfileDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface AuthResult {
  user: UserProfileDTO;
  token: string;
}

export interface IAuthService {
  register(payload: RegisterDTO): Promise<AuthResult>;
  login(payload: LoginDTO): Promise<AuthResult>;
  getProfile(userId: string): Promise<UserProfileDTO>;
  logout(userId: string): Promise<void>;
  requestPasswordReset(payload: ForgotPasswordDTO): Promise<void>;
  resetPassword(payload: ResetPasswordDTO): Promise<void>;
  sendEmailVerification(userId: string): Promise<void>;
  verifyEmail(payload: VerifyEmailConfirmDTO): Promise<void>;
}

