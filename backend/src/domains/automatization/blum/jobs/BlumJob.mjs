import AdsApi from '../../../../api/AdsApi.mjs';
import {hoverAndClick, wait} from '../../../../automatization/helpers/puppeteerHelpers.mjs';
import {retryMethodWithReload} from '../../../../helpers/retryMethod.mjs';
import BlumPlayClickerGameHandler from './handlers/BlumPlayClickerGameHandler.mjs';

class BlumJob {
  constructor(job, {profile, keepOpenProfileIds}) {
    this.job = job;
    this.profile = profile;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.questUrl = 'https://web.telegram.org/a/#6865543862';

    this.browser = null;
    this.tgPage = null;
    this.blumFrame = null;
  }

  async run() {
    try {
      const browser = await AdsApi.connectToPuppeteer(this.profile.id);

      try {
        await this.startQuests(browser);
      } finally {
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async startQuests(browser) {
    this.browser = browser;

    try {
      this.tgPage = await this.openBlumBot();
      await wait(4000, 7000);
      await retryMethodWithReload(this.tgPage, async () => this.blumFrame = await this.getBlumBotFrame(this.tgPage));

      await this.completeDailyCheckIn(this.blumFrame);
      await wait(4212, 6421);

      await this.claimAndRunFarmPoints(this.blumFrame);
      await wait(1304, 4210);

      // await new BlumJobWeeklyHandler(this.browser, this.tgPage, this.blumFrame).run();
      await new BlumPlayClickerGameHandler().run(this.blumFrame, this.tgPage);
      await wait(1304, 4210);
    } catch (e) {
      throw e;
    } finally {
      await this.tgPage.close();
    }
  }

  async openBlumBot() {
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

  async getBlumBotFrame(tgPage) {
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

  async completeDailyCheckIn(blumFrame) {
    try {
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
    } catch (e) {
      throw e;
    }
  }

  async claimAndRunFarmPoints(blumFrame) {
    try {
      const farmButton = await blumFrame.$('.index-farming-button button');

      if (!farmButton) {
        throw new Error('Daily CheckIn. Continue button not found.');
      }

      const farmButtonText = await farmButton.evaluate(el => el.textContent.toLowerCase());

      if (farmButtonText.includes('start farming')) {
        await hoverAndClick(farmButton);
        return;
      }

      if (farmButtonText.includes('claim')) {
        await hoverAndClick(farmButton);
        await wait(4000, 7000);
        const startFarmButton = await blumFrame.$('.index-farming-button button');
        await hoverAndClick(startFarmButton);
      }
    } catch (e) {
      throw e;
    }
  }
}

export default BlumJob;
