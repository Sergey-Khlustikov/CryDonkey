import { Module } from '@nestjs/common';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { BullModule } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { ProjectQueuesManagerController } from '@src/modules/projects/controllers/project-queues-manager.controller.js';

const defaultJobOptions = {
  removeOnComplete: true,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
};

@Module({
  imports: [
    BullModule.registerQueue(
      { name: EQueueNames.Idao, defaultJobOptions },
      { name: EQueueNames.Rcade, defaultJobOptions },
      { name: EQueueNames.DawnAuth, defaultJobOptions },
      { name: EQueueNames.Blum, defaultJobOptions },
      { name: EQueueNames.TwitterPost, defaultJobOptions },
      { name: EQueueNames.RabbyUnlock, defaultJobOptions },
    ),
  ],
  providers: [ProjectQueuesManagerService],
  controllers: [ProjectQueuesManagerController],
  exports: [BullModule, ProjectQueuesManagerService],
})
export class ProjectQueuesManagerModule {}
