import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { DawnExtensionService } from '@src/modules/extensions/dawn/dawn-extension.service.js';
import { minimizeBrowser, wait } from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import minuteToMs from '@src/common/helpers/minuteToMs.js';
import accountsData from '../structures/accountsData.js';
import { Job, UnrecoverableError } from 'bullmq';
import { Browser, Page } from 'puppeteer';
import { Processor } from '@nestjs/bullmq';
import { EQueueNames, IBaseJobProfile } from '@crydonkey/shared';

@Processor(EQueueNames.DawnAuth)
export class DawnCheckAuthProcessor extends AutomationProjectProcessor {
  protected readonly queueName: EQueueNames = EQueueNames.DawnAuth;

  protected profile: IBaseJobProfile;
  protected userId: string;
  protected page: Page;
  protected browser: Browser;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
    protected dawnExtensionService: DawnExtensionService,
  ) {
    super(queuesManager);
  }

  async handleJob(job: Job): Promise<any> {
    const { profile, userId } = job.data;

    this.profile = profile;
    this.userId = userId;

    await this.run();
  }

  async run(): Promise<void> {
    try {
      this.browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );

      try {
        await this.start();
      } finally {
        await minimizeBrowser(this.browser);
      }
    } catch (e) {
      throw e;
    }
  }

  async start(): Promise<void> {
    this.page = await this.dawnExtensionService.openDashboardPage(this.browser);

    await wait(5000, 5000);

    if (await this.page.$('input#email')) {
      await this.fillForm();
      throw new UnrecoverableError('Not authorized');
    }

    try {
      const selector = '#dawnbalance';
      const timeout = minuteToMs(1);

      await this.page.waitForSelector(selector, { timeout });
      await this.page.waitForFunction(
        (selector) => {
          const element = document.querySelector(selector);
          return (
            element &&
            element.textContent &&
            element.textContent.trim().length > 0
          );
        },
        { timeout },
        selector,
      );
    } catch (e) {
      throw e;
    } finally {
      await this.page.close();
    }
  }

  async fillForm(): Promise<void> {
    const accountData = accountsData.find((data) => {
      return data.profileId === this.profile.id;
    });

    if (!accountData) {
      throw new Error('Could not find account data');
    }

    const emailInput = await this.page.$('input#email');
    await emailInput?.type(accountData.email);

    const passwordInput = await this.page.$('input#password');
    await passwordInput?.type(accountData.password);
  }
}
