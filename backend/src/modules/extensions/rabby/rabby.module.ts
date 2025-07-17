import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbyService } from '@src/modules/extensions/rabby/services/rabby.service.js';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { RabbyController } from '@src/modules/extensions/rabby/controllers/rabby.controller.js';
import { RabbyQueueService } from '@src/modules/extensions/rabby/services/rabby-queue.service.js';
import { RabbyUnlockProcessor } from '@src/modules/extensions/rabby/processors/rabby-unlock.processor.js';

@Module({
  imports: [ConfigModule, AdsPowerModule, ProjectQueuesManagerModule],
  controllers: [RabbyController],
  providers: [RabbyService, RabbyQueueService, RabbyUnlockProcessor],
  exports: [RabbyService],
})
export class RabbyModule {}
