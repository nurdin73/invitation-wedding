import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema/users.schema';
import type { IUserRepository, UserRecord } from '../user-repository.port';

export class DrizzleUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserRecord | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async create(data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const [created] = await db.insert(users).values(data).returning();
    return this.mapToRecord(created);
  }

  async update(id: string, data: Partial<Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserRecord> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return this.mapToRecord(updated);
  }

  private mapToRecord(row: typeof users.$inferSelect): UserRecord {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      fullName: row.fullName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
