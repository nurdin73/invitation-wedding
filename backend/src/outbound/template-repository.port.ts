export interface TemplateRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  category: string;
  themeConfig: Record<string, unknown>;
  sampleContent: Record<string, unknown>;
  sections: unknown[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITemplateRepository {
  findAllActive(): Promise<TemplateRecord[]>;
  findBySlug(slug: string): Promise<TemplateRecord | null>;
  findById(id: string): Promise<TemplateRecord | null>;
  upsert(template: Omit<TemplateRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<TemplateRecord>;
}
