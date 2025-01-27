import { Module } from '@nestjs/common';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { RcadeController } from '@src/modules/projects/rcade/controllers/rcade.controller.js';
import { RcadeQueueService } from '@src/modules/projects/rcade/services/rcade-queue.service.js';
import { RcadeQueueProcessor } from '@src/modules/projects/rcade/processors/rcade-queue.processor.js';

@Module({
  imports: [AdsPowerModule, ProjectQueuesManagerModule],
  controllers: [RcadeController],
  providers: [RcadeQueueService, RcadeQueueProcessor],
})
export class RcadeModule {}
