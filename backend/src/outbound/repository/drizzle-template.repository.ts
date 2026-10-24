import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { templates } from '../../db/schema/templates.schema';
import type { ITemplateRepository, TemplateRecord } from '../template-repository.port';

export class DrizzleTemplateRepository implements ITemplateRepository {
  async findAllActive(): Promise<TemplateRecord[]> {
    const results = await db.select().from(templates).where(eq(templates.isActive, true));
    return results.map((r) => this.mapToRecord(r));
  }

  async findBySlug(slug: string): Promise<TemplateRecord | null> {
    const result = await db.select().from(templates).where(eq(templates.slug, slug)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async findById(id: string): Promise<TemplateRecord | null> {
    const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    if (!result[0]) return null;
    return this.mapToRecord(result[0]);
  }

  async upsert(data: Omit<TemplateRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<TemplateRecord> {
    const existing = await this.findBySlug(data.slug);
    if (existing) {
      const [updated] = await db
        .update(templates)
        .set({
          name: data.name,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          category: data.category,
          themeConfig: data.themeConfig,
          sampleContent: data.sampleContent,
          sections: data.sections,
          isActive: data.isActive,
          updatedAt: new Date(),
        })
        .where(eq(templates.slug, data.slug))
        .returning();
      return this.mapToRecord(updated);
    }

    const [created] = await db
      .insert(templates)
      .values({
        slug: data.slug,
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        themeConfig: data.themeConfig,
        sampleContent: data.sampleContent,
        sections: data.sections,
        isActive: data.isActive,
      })
      .returning();
    return this.mapToRecord(created);
  }

  private mapToRecord(row: typeof templates.$inferSelect): TemplateRecord {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
      category: row.category,
      themeConfig: row.themeConfig as Record<string, unknown>,
      sampleContent: row.sampleContent as Record<string, unknown>,
      sections: row.sections as unknown[],
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
