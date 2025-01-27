import { Module } from '@nestjs/common';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { BlumController } from '@src/modules/projects/blum/controllers/blum.controller.js';
import { BlumService } from '@src/modules/projects/blum/services/blum.service.js';
import { BlumProcessor } from '@src/modules/projects/blum/processors/blum.processor.js';

@Module({
  imports: [AdsPowerModule, ProjectQueuesManagerModule],
  controllers: [BlumController],
  providers: [BlumService, BlumProcessor],
})
export class BlumModule {}
