import { Processor } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { RabbyService } from '@src/modules/extensions/rabby/services/rabby.service.js';
import { Job } from 'bullmq';
import { minimizeBrowser } from '@src/common/helpers/puppeteer/puppeteerHelpers.js';

@Processor(EQueueNames.RabbyUnlock)
export class RabbyUnlockProcessor extends AutomationProjectProcessor {
  protected readonly queueName: EQueueNames = EQueueNames.RabbyUnlock;

  protected profile: IBaseJobProfile;
  protected userId: string;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
    protected rabbyService: RabbyService,
  ) {
    super(queuesManager);
  }

  protected async handleJob(job: Job): Promise<any> {
    const { profile, userId } = job.data;

    this.profile = profile;
    this.userId = userId;

    await this.run();
  }

  async run(): Promise<void> {
    try {
      const browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );

      try {
        await this.rabbyService.unlockFullPage(browser, { keepPageOpen: true });
      } finally {
        await minimizeBrowser(browser);
      }
    } catch (e) {
      throw e;
    }
  }
}
