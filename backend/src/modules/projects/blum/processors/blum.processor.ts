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
import { PuppeteerUtil } from '@src/common/helpers/puppeteer/PuppeteerUtil.js';
import { IBlumOptions } from '@src/modules/projects/blum/dto/blum-run.dto.js';

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
    const { profile, userId, keepOpenProfile } = job.data;
    const options: IBlumOptions = job.data.options;

    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfile = keepOpenProfile;
    this.playGame = options.playGame;

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
    await this.navigateToPage('home', this.blumFrame);

    await this.completeDailyCheckIn(this.blumFrame);
    await wait(2212, 4421);

    await this.claimAndRunFarmPoints(this.blumFrame);
    await wait(1304, 4210);

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
    await blumFrame.waitForSelector('.pages-index-daily-reward');
    await wait(1021, 3512);

    const claimBtn = await blumFrame.$('.pages-index-daily-reward button');

    if (!claimBtn) {
      throw new Error('Daily CheckIn. Claim button not found.');
    }

    if (await PuppeteerUtil.elementHasClass(claimBtn, 'is-state-claimed')) {
      return;
    }

    await hoverAndClick(claimBtn);
  }

  async claimAndRunFarmPoints(blumFrame: Frame) {
    await wait(1134, 3123);

    while (true) {
      const claimButton = await blumFrame.$(
        '.pages-wallet-asset-farming-slot button',
      );

      if (!claimButton) {
        throw new Error('Claim button not found');
      }

      if (await PuppeteerUtil.elementHasClass(claimButton, 'farming')) {
        break;
      }

      await hoverAndClick(claimButton);
      await wait(1134, 3123);
    }
  }

  async navigateToPage(pageName: string, blumFrame: Frame) {
    const homeBtn = await getButtonByText(blumFrame, pageName, {
      buttonTag: 'a',
    });

    if (!homeBtn) {
      throw new Error(`Unable to find ${pageName} button`);
    }

    await hoverAndClick(homeBtn);
  }
}
