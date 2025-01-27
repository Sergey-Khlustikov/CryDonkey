import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';
import { Browser, Frame, Page } from 'puppeteer';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { Job } from 'bullmq';
import {
  hoverAndClick,
  minimizeBrowser,
  wait,
} from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import { retryMethodWithReload } from '@src/common/helpers/retryMethod.js';
import BlumPlayClickerGameHandler from './handlers/blum.play-clicker-game.handler.js';
import getButtonByText from '@src/common/helpers/puppeteer/getButtonByText.js';
import { Processor } from '@nestjs/bullmq';

@Processor(EQueueNames.Blum)
export class BlumProcessor extends AutomationProjectProcessor {
  protected readonly queueName = EQueueNames.Blum;

  protected profile: IBaseJobProfile;
  protected userId: string;
  protected questUrl: string = 'https://web.telegram.org/a/#6865543862';
  protected browser: Browser;
  protected tgPage: Page;
  protected blumFrame: Frame;
  protected keepOpenProfile: boolean;
  protected playGame: boolean;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
  ) {
    super(queuesManager);
  }

  protected handleJob(job: Job): Promise<any> {
    const { profile, userId, keepOpenProfile, playGame } = job.data;

    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfile = keepOpenProfile;
    this.playGame = playGame;

    return this.run();
  }

  private async run(): Promise<void> {
    try {
      this.browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );
      this.tgPage = await this.browser.newPage();

      try {
        await this.startQuests();
      } finally {
        await this.tgPage.close();

        if (!this.keepOpenProfile) {
          await this.browser.close();
        } else {
          await minimizeBrowser(this.browser);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  private async startQuests(): Promise<void> {
    this.tgPage = await this.openBlumBot();
    await wait(4000, 7000);
    await retryMethodWithReload(
      this.tgPage,
      async () => (this.blumFrame = await this.getBlumBotFrame(this.tgPage)),
    );
    await wait(4212, 6421);
    await this.completeDailyCheckIn(this.blumFrame);
    await wait(2212, 4421);

    await this.claimAndRunFarmPoints(this.blumFrame);
    await wait(1304, 4210);

    // await new BlumWeeklyJobHandler(this.browser, this.tgPage, this.blumFrame).run();
    if (this.playGame) {
      await new BlumPlayClickerGameHandler().run(this.blumFrame, this.tgPage);
    }

    await wait(1304, 4210);
  }

  private async openBlumBot(): Promise<Page> {
    await this.tgPage.goto(this.questUrl, { waitUntil: 'networkidle2' });
    await wait(2000, 4000);
    const btn = await this.tgPage.$('button.open::-p-text(Launch Blum)');

    if (btn) {
      await hoverAndClick(btn);
      return this.tgPage;
    } else {
      throw new Error('button not found');
    }
  }

  async getBlumBotFrame(tgPage: Page): Promise<Frame> {
    const modalIframe = await tgPage.waitForSelector('.Modal iframe');

    if (!modalIframe) {
      throw new Error('Modal iframe not found.');
    }

    const iframeContent = await modalIframe.contentFrame();

    if (!iframeContent) {
      throw new Error('Unable to access content inside iframe');
    }

    return iframeContent;
  }

  async completeDailyCheckIn(blumFrame: Frame) {
    await wait(5021, 9512);
    const rewardPage = await blumFrame.$('.daily-reward-page');

    if (!rewardPage) {
      return;
    }

    const continueBtn = await blumFrame.$('button.kit-button');

    if (!continueBtn) {
      throw new Error('Daily CheckIn. Continue button not found.');
    }

    await hoverAndClick(continueBtn);
  }

  async claimAndRunFarmPoints(blumFrame: Frame) {
    const homeBtn = await getButtonByText(blumFrame, 'home', {
      buttonTag: 'a',
    });

    if (!homeBtn) {
      throw new Error('Unable to find home button');
    }

    await hoverAndClick(homeBtn);
    await wait(1134, 3123);

    const farmButton = await blumFrame.$('.index-farming-button button');

    if (!farmButton) {
      throw new Error('Farm button not found.');
    }

    const farmButtonText = await farmButton.evaluate((el) => {
      const text = el.textContent;
      return text ? text.toLowerCase() : '';
    });

    if (farmButtonText.includes('start farming')) {
      await hoverAndClick(farmButton);
      return;
    }

    if (farmButtonText.includes('claim')) {
      await hoverAndClick(farmButton);
      await wait(1400, 4010);
      const startFarmButton = await blumFrame.$('.index-farming-button button');

      if (startFarmButton) {
        await hoverAndClick(startFarmButton);
      } else {
        throw new Error('Start farming button not found.');
      }
    }
  }
}
