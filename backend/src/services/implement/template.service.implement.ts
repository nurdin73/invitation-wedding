import { AppDomainError } from '../../configs/response.helper';
import { META_CODES } from '../../constants/meta-codes';
import type { ITemplateRepository, TemplateRecord } from '../../outbound/template-repository.port';
import type { ITemplateService } from '../template.service';

export class TemplateServiceImplement implements ITemplateService {
  constructor(private readonly templateRepo: ITemplateRepository) {}

  async getActiveTemplates(): Promise<TemplateRecord[]> {
    return await this.templateRepo.findAllActive();
  }

  async getTemplateById(id: string): Promise<TemplateRecord> {
    const template = await this.templateRepo.findById(id);
    if (!template || !template.isActive) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Template desain undangan tidak ditemukan.',
        404
      );
    }
    return template;
  }

  async getTemplateBySlug(slug: string): Promise<TemplateRecord> {
    const template = await this.templateRepo.findBySlug(slug);
    if (!template || !template.isActive) {
      throw new AppDomainError(
        META_CODES.RESOURCE_NOT_FOUND,
        'Template desain undangan tidak ditemukan.',
        404
      );
    }
    return template;
  }
}
