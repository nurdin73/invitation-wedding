import { eq, and, count } from 'drizzle-orm';
import { db } from '../../db';
import { invitations } from '../../db/schema/invitations.schema';
import type {
  IInvitationRepository,
  InvitationRecord,
  UpdateInvitationPayload,
} from '../invitation-repository.port';

export class DrizzleInvitationRepository implements IInvitationRepository {
  async findById(id: string): Promise<InvitationRecord | null> {
    const result = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findBySlug(slug: string): Promise<InvitationRecord | null> {
    const result = await db.select().from(invitations).where(eq(invitations.slug, slug)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findByUserId(userId: string): Promise<InvitationRecord[]> {
    const results = await db.select().from(invitations).where(eq(invitations.userId, userId));
    return results.map((r) => this.mapToRecord(r));
  }

  async countByUserId(userId: string): Promise<number> {
    const [result] = await db
      .select({ total: count() })
      .from(invitations)
      .where(eq(invitations.userId, userId));
    return Number(result?.total || 0);
  }

  async findPublishedByUserId(userId: string): Promise<InvitationRecord | null> {
    const result = await db
      .select()
      .from(invitations)
      .where(and(eq(invitations.userId, userId), eq(invitations.isPublished, true)))
      .limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async unpublishAllByUserId(userId: string): Promise<void> {
    await db
      .update(invitations)
      .set({ isPublished: false, updatedAt: new Date() })
      .where(eq(invitations.userId, userId));
  }

  async create(data: Omit<InvitationRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<InvitationRecord> {
    const [created] = await db
      .insert(invitations)
      .values({
        userId: data.userId,
        slug: data.slug,
        title: data.title,
        themeConfig: data.themeConfig,
        content: data.content,
        sections: data.sections,
        isPublished: data.isPublished,
      })
      .returning();
    return this.mapToRecord(created);
  }

  async updatePayload(
    id: string,
    payload: UpdateInvitationPayload
  ): Promise<InvitationRecord> {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (payload.themeConfig !== undefined) updateData.themeConfig = payload.themeConfig;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.sections !== undefined) updateData.sections = payload.sections;

    const [updated] = await db
      .update(invitations)
      .set(updateData)
      .where(eq(invitations.id, id))
      .returning();
    return this.mapToRecord(updated);
  }

  async setPublishStatus(id: string, isPublished: boolean): Promise<InvitationRecord> {
    const [updated] = await db
      .update(invitations)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, id))
      .returning();
    return this.mapToRecord(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(invitations).where(eq(invitations.id, id)).returning();
    return result.length > 0;
  }

  private mapToRecord(row: typeof invitations.$inferSelect): InvitationRecord {
    return {
      id: row.id,
      userId: row.userId,
      slug: row.slug,
      title: row.title,
      themeConfig: row.themeConfig as Record<string, unknown>,
      content: row.content as Record<string, unknown>,
      sections: row.sections as unknown[],
      isPublished: row.isPublished,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

