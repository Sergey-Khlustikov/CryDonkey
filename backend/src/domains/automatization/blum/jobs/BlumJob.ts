import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {hoverAndClick, minimizeBrowser, wait} from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import {retryMethodWithReload} from '#src/helpers/retryMethod.js';
import BlumPlayClickerGameHandler from "#src/domains/automatization/blum/jobs/handlers/BlumPlayClickerGameHandler.js";
import {Browser, Frame, Page} from "puppeteer";
import IBlumJobOptions from "#src/domains/automatization/blum/interfaces/IBlumJobOptions.js";
import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";

class BlumJob {
  private profile: IBaseJobProfile;
  private keepOpenProfileIds: Array<number | string>;
  private questUrl: string;
  private browser: any;
  private tgPage: any;
  private blumFrame: any;
  private playGame: boolean;

  constructor(job: IBlumJobOptions) {
    const {profile, keepOpenProfileIds, options} = job.data;

    this.profile = profile;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.questUrl = 'https://web.telegram.org/a/#6865543862';
    this.playGame = options.playGame;

    this.browser = null;
    this.tgPage = null;
    this.blumFrame = null;
  }

  public async run(): Promise<void> {
    try {
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id);

      try {
        await this.startQuests(browser);
      } finally {
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        } else {
          await minimizeBrowser(browser)
        }
      }
    } catch (e) {
      throw e;
    }
  }

  public async startQuests(browser: Browser): Promise<void> {
    this.browser = browser;

    try {
      this.tgPage = await this.openBlumBot();
      await wait(4000, 7000);
      await retryMethodWithReload(this.tgPage, async () => this.blumFrame = await this.getBlumBotFrame(this.tgPage));
      await wait(4212, 6421);
      await this.completeDailyCheckIn(this.blumFrame);
      await wait(2212, 4421);

      await this.claimAndRunFarmPoints(this.blumFrame);
      await wait(1304, 4210);

      // await new BlumJobWeeklyHandler(this.browser, this.tgPage, this.blumFrame).run();
      if (this.playGame) {
        await new BlumPlayClickerGameHandler().run(this.blumFrame, this.tgPage);
      }

      await wait(1304, 4210);
    } catch (e) {
      throw e;
    } finally {
      await this.tgPage.close();
    }
  }

  private async openBlumBot(): Promise<Page> {
    const page = await this.browser.newPage();

    await page.goto(this.questUrl, {waitUntil: 'networkidle2'});
    await wait(2000, 4000);
    const btn = await page.$('button.open::-p-text(Launch Blum)');

    if (btn) {
      await hoverAndClick(btn);
      return page;
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
    const farmButton = await blumFrame.$('.index-farming-button button');

    if (!farmButton) {
      throw new Error('Daily CheckIn. Continue button not found.');
    }

    const farmButtonText = await farmButton.evaluate(el => {
      const text = el.textContent;
      return text ? text.toLowerCase() : '';
    });

    if (farmButtonText.includes('start farming')) {
      await hoverAndClick(farmButton);
      return;
    }

    if (farmButtonText.includes('claim')) {
      await hoverAndClick(farmButton);
      await wait(4000, 7000);
      const startFarmButton = await blumFrame.$('.index-farming-button button');

      if (startFarmButton) {
        await hoverAndClick(startFarmButton);
      } else {
        throw new Error('Start farming button not found.');
      }
    }
  }
}

export default BlumJob;
