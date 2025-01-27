import { Module } from '@nestjs/common';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { DawnExtensionModule } from '@src/modules/extensions/dawn/dawn-extension.module.js';
import { DawnController } from '@src/modules/projects/dawn/controllers/dawn.controller.js';
import { DawnService } from '@src/modules/projects/dawn/services/dawn.service.js';
import { DawnCheckAuthProcessor } from '@src/modules/projects/dawn/processors/dawn-check-auth.processor.js';

@Module({
  imports: [AdsPowerModule, DawnExtensionModule, ProjectQueuesManagerModule],
  controllers: [DawnController],
  providers: [DawnService, DawnCheckAuthProcessor],
})
export class DawnModule {}
