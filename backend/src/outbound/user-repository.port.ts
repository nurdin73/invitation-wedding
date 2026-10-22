import type { UserRole } from '../db/schema/users.schema';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  create(data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt' | 'isEmailVerified' | 'emailVerifiedAt'> & {
    role?: UserRole;
    isEmailVerified?: boolean;
    emailVerifiedAt?: Date | null;
  }): Promise<UserRecord>;
  update(id: string, data: Partial<Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserRecord>;
}

