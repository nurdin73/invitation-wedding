import type { TemplateRecord } from '../outbound/template-repository.port';

export interface ITemplateService {
  getActiveTemplates(): Promise<TemplateRecord[]>;
  getTemplateById(id: string): Promise<TemplateRecord>;
  getTemplateBySlug(slug: string): Promise<TemplateRecord>;
}
