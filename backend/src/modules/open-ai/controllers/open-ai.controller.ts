import { Body, Controller, Post } from '@nestjs/common';
import { BaseController } from '@src/common/controllers/base.controller.js';
import { OpenAiService } from '@src/modules/open-ai/services/open-ai.service.js';
import { GenerateMessageDto } from '@src/modules/open-ai/dto/generate-message.dto.js';

@Controller('open-ai')
export class OpenAiController extends BaseController {
  constructor(private readonly openAiService: OpenAiService) {
    super();
  }

  @Post('generate-message')
  async generateMessage(@Body() dto: GenerateMessageDto) {
    return this.createResponse(await this.openAiService.generateMessage(dto));
  }
}
