import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateMessageDto } from '@src/modules/open-ai/dto/generate-message.dto.js';

@Injectable()
export class OpenAiService {
  private readonly api: OpenAI;
  private model: string = 'gpt-4o-mini';

  constructor(private configService: ConfigService) {
    this.api = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateMessage(dto: GenerateMessageDto): Promise<string> {
    const completion = await this.api.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: dto.prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
