import { ResponseHelper } from '../../../configs/response.helper';
import { META_CODES } from '../../../constants/meta-codes';
import type { ITemplateService } from '../../../services/template.service';

export class TemplateController {
  constructor(private readonly templateService: ITemplateService) {}

  async getAllActive() {
    const result = await this.templateService.getActiveTemplates();
    return ResponseHelper.success(result, 'Daftar template desain berhasil diambil.', META_CODES.SUCCESS_OK);
  }

  async getById(id: string) {
    const result = await this.templateService.getTemplateById(id);
    return ResponseHelper.success(result, 'Detail template desain berhasil diambil.', META_CODES.SUCCESS_OK);
  }
}
