import type { UserRecord } from '../outbound/user-repository.port';

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
  };
  token: string;
}

export interface IAuthService {
  register(payload: RegisterDTO): Promise<AuthResult>;
  login(payload: LoginDTO): Promise<AuthResult>;
  getProfile(userId: string): Promise<AuthResult['user']>;
}
