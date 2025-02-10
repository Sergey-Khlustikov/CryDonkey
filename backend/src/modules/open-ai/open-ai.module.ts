import { Module } from '@nestjs/common';
import { OpenAiController } from '@src/modules/open-ai/controllers/open-ai.controller.js';
import { OpenAiService } from '@src/modules/open-ai/services/open-ai.service.js';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
