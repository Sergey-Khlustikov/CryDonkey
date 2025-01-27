import { Module } from '@nestjs/common';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { OpenAiModule } from '@src/modules/open-ai/open-ai.module.js';
import { TwitterController } from '@src/modules/twitter/controllers/twitter.controller.js';
import { TwitterService } from '@src/modules/twitter/services/twitter.service.js';
import { TwitterWritePostProcessor } from '@src/modules/twitter/processors/twitter.write-post.processor.js';
import { TwitterQueuesService } from '@src/modules/twitter/services/twitter.queues.service.js';

@Module({
  imports: [AdsPowerModule, ProjectQueuesManagerModule, OpenAiModule],
  controllers: [TwitterController],
  providers: [TwitterService, TwitterQueuesService, TwitterWritePostProcessor],
  exports: [TwitterService],
})
export class TwitterModule {}
