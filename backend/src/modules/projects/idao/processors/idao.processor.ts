import { Processor } from '@nestjs/bullmq';
import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import { Job } from 'bullmq';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';
import { Browser, Page } from 'puppeteer';
import IIdaoForecastOptions from '@src/modules/projects/idao/types/idao-forecast-options.interface.js';
import {
  hoverAndClick,
  minimizeBrowser,
  wait,
} from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import { IdaoForecastHandler } from '@src/modules/projects/idao/processors/handlers/idao-forecast.handler.js';
import { retryMethodWithReload } from '@src/common/helpers/retryMethod.js';
import getButtonByText from '@src/common/helpers/puppeteer/getButtonByText.js';
import PageScroller from '@src/common/helpers/puppeteer/PageScroller.js';
import { RabbyService } from '@src/modules/extensions/rabby/services/rabby.service.js';

@Processor(EQueueNames.Idao)
export class IdaoQueueProcessor extends AutomationProjectProcessor {
  protected readonly queueName: EQueueNames = EQueueNames.Idao;

  protected profile: IBaseJobProfile;
  protected userId: string;
  protected questUrl: string = 'https://forecast.idao.finance/';
  protected page: Page;
  protected browser: Browser;
  protected keepOpenProfile: boolean;
  protected forecastOptions: IIdaoForecastOptions;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
    protected rabbyService: RabbyService,
  ) {
    super(queuesManager);
  }

  protected async handleJob(job: Job): Promise<any> {
    const { profile, userId, keepOpenProfile, forecastOptions } = job.data;

    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfile = keepOpenProfile;
    this.forecastOptions = forecastOptions;

    await this.run();
  }

  async run(): Promise<void> {
    try {
      const browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );

      try {
        await this.startQuests(browser);
      } finally {
        await this.page.close();

        if (!this.keepOpenProfile) {
          await browser.close();
        } else {
          await minimizeBrowser(browser);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async startQuests(browser: Browser): Promise<void> {
    this.browser = browser;

    await this.rabbyService.unlockFullPage(this.browser);

    this.page = await this.browser.newPage();

    await this.page.goto(this.questUrl, { waitUntil: 'networkidle2' });

    await wait(1012, 5012);

    if (!(await this.isAuthenticated())) {
      throw new Error('Not authenticated');
    }

    await new IdaoForecastHandler({
      browser: this.browser,
      page: this.page,
      forecastOptions: this.forecastOptions,
      walletService: this.rabbyService,
    }).run();
    await wait(2122, 5121);
    await retryMethodWithReload(this.page, () => this.claimPoints());
    await wait(4122, 10121);
  }

  async isAuthenticated(): Promise<boolean> {
    return !(await getButtonByText(this.page, 'connect wallet'));
  }

  async claimPoints(): Promise<void> {
    const pageScroller = new PageScroller({
      page: this.page,
      scrollableTag: 'html',
    });
    await pageScroller.scrollToBottom();
    await wait(3121, 6121);

    const clearBtn = await getButtonByText(this.page, 'clear', {
      strict: false,
    });

    if (clearBtn) {
      await hoverAndClick(clearBtn);
      return;
    }

    const claimBtn = await getButtonByText(this.page, 'claim', {
      strict: false,
    });

    if (!claimBtn) {
      return;
    }

    await hoverAndClick(claimBtn);
    const walletPage = await this.rabbyService.waitForExtensionOpen(
      this.browser,
    );
    await wait(5211, 8121);
    await this.rabbyService.signTransaction(walletPage, { maxGasFee: 0.1 });

    await this.page.waitForFunction((btn) => !btn.isConnected, {}, claimBtn);
  }
}
