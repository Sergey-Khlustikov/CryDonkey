import { Module } from '@nestjs/common';
import { DawnExtensionService } from '@src/modules/extensions/dawn/dawn-extension.service.js';

@Module({
  providers: [DawnExtensionService],
  exports: [DawnExtensionService],
})
export class DawnExtensionModule {}
