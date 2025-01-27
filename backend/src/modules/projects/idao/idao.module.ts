import { Module } from '@nestjs/common';
import { IdaoQueueService } from '@src/modules/projects/idao/services/idao-queue.service.js';
import { IdaoQueueProcessor } from '@src/modules/projects/idao/processors/idao.processor.js';
import { RabbyModule } from '@src/modules/extensions/rabby/rabby.module.js';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { IdaoController } from '@src/modules/projects/idao/controllers/idao.controller.js';

@Module({
  imports: [RabbyModule, AdsPowerModule, ProjectQueuesManagerModule],
  controllers: [IdaoController],
  providers: [IdaoQueueService, IdaoQueueProcessor],
})
export class IdaoModule {}
