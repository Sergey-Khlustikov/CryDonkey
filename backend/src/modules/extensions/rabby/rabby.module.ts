import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbyService } from '@src/modules/extensions/rabby/rabby.service.js';

@Module({
  imports: [ConfigModule],
  providers: [RabbyService],
  exports: [RabbyService],
})
export class RabbyModule {}
