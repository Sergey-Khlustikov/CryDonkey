import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetamaskService } from '@src/modules/extensions/metamask/metamask.service.js';

@Module({
  imports: [ConfigModule],
  providers: [MetamaskService],
  exports: [MetamaskService],
})
export class MetamaskModule {}
