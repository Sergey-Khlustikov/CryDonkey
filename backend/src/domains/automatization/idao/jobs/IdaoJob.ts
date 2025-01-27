import AdsPowerService from '#src/domains/ads/services/AdsPowerService.js';
import { hoverAndClick, minimizeBrowser, wait } from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import IIdaoJobOptions from '#src/domains/automatization/idao/interfaces/IIdaoJobOptions.js';
import IBaseJobProfile from '#src/domains/queues/structures/interfaces/IBaseJobProfile.js';
import { Browser, Page } from 'puppeteer';
import getButtonByText from '#src/domains/puppeteer/helpers/getButtonByText.js';
import IdaoForecastHandler from '#src/domains/automatization/idao/jobs/handlers/IdaoForecastHandler.js';
import IIdaoForecastOptions from '#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js';
import PageScroller from '#src/domains/puppeteer/helpers/PageScroller.js';
import { retryMethodWithReload } from '#src/helpers/retryMethod.js';
import Rabby from '#src/domains/extensions/rabby/Rabby.js';

class IdaoJob {
  protected job: IIdaoJobOptions;
  protected profile: IBaseJobProfile;
  protected userId: string;
  protected questUrl: string;
  protected page!: Page;
  protected browser!: Browser;
  private keepOpenProfileIds: string[];
  private forecastOptions: IIdaoForecastOptions;

  constructor(job: IIdaoJobOptions) {
    const {profile, userId, keepOpenProfileIds, forecastOptions} = job.data;

    this.job = job;
    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.forecastOptions = forecastOptions;
    this.questUrl = 'https://forecast.idao.finance/';
  }

  async run(): Promise<void> {
    try {
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id, this.userId);

      try {
        await this.startQuests(browser);
      } finally {
        await this.page.close();

        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        } else {
          await minimizeBrowser(browser)
        }
      }
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  async startQuests(browser: Browser): Promise<void> {
    this.browser = browser;

    await Rabby.unlockFullPage(this.browser);

    this.page = await this.browser.newPage();

    await this.page.goto(this.questUrl, {waitUntil: 'networkidle2'});

    await wait(1012, 5012);

    if (!await this.isAuthenticated()) {
      throw new Error('Not signed in');
    }

    await new IdaoForecastHandler(this.browser, this.page, this.forecastOptions).run();
    await wait(2122, 5121);
    await retryMethodWithReload(this.page, () => this.claimPoints())
    await wait(4122, 10121);
  }

  async isAuthenticated(): Promise<boolean> {
    return !await getButtonByText(this.page, 'connect wallet')
  }

  async claimPoints(): Promise<void> {
    const pageScroller = new PageScroller({page: this.page, scrollableTag: 'html'});
    await pageScroller.scrollToBottom();
    await wait(3121, 6121);

    const clearBtn = await getButtonByText(this.page, 'clear', {strict: false});

    if (clearBtn) {
      await hoverAndClick(clearBtn);
      return
    }

    const claimBtn = await getButtonByText(this.page, 'claim', {strict: false});

    if (!claimBtn) {
      return
    }

    await hoverAndClick(claimBtn)
    const rabbyPage = await Rabby.waitForExtensionOpen(this.browser);
    await wait(5211, 8121);
    await Rabby.signTransaction(rabbyPage, { maxGasFee: 0.1 });

    await this.page.waitForFunction(
      (btn) => !btn.isConnected,
      {},
      claimBtn
    );
  }
}

export default IdaoJob;
