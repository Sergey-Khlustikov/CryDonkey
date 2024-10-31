import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {hoverAndClick, minimizeBrowser, wait} from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import IIdaoJobOptions from "#src/domains/automatization/idao/interfaces/IIdaoJobOptions.js";
import IIdaoProfile from "#src/domains/automatization/idao/interfaces/IIdaoProfile.js";
import {Browser, Page} from "puppeteer";
import Metamask from "#src/domains/extensions/metamask/Metamask.js";
import getButtonByText from "#src/domains/puppeteer/helpers/getButtonByText.js";
import IdaoForecastHandler from "#src/domains/automatization/idao/jobs/handlers/IdaoForecastHandler.js";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js";
import PageScroller from "#src/domains/puppeteer/helpers/PageScroller.js";
import {retryMethodWithReload} from "#src/helpers/retryMethod.js";

class IdaoJob {
  protected job: IIdaoJobOptions;
  protected profile: IIdaoProfile;
  protected questUrl: string;
  protected page: Page;
  protected browser: Browser;
  private keepOpenProfileIds: string[];
  private forecastOptions: IIdaoForecastOptions;

  constructor(job: IIdaoJobOptions) {
    const {profile, keepOpenProfileIds, forecastOptions} = job.data;

    this.job = job;
    this.profile = profile;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.forecastOptions = forecastOptions;
    this.questUrl = 'https://forecast.idao.finance/';
  }

  async run(): Promise<void> {
    try {
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id);

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

    await Metamask.unlockFullPage(this.browser)

    this.page = await this.browser.newPage();

    await this.page.goto(this.questUrl, {waitUntil: 'networkidle2'});

    await wait(1012, 5012);

    if (!await this.isAuthenticated()) {
      await this.signIn()
      await wait(2112, 4121)
    }

    await new IdaoForecastHandler(this.browser, this.page, this.forecastOptions).run();
    await wait(2122, 5121);
    await retryMethodWithReload(this.page, () => this.claimPoints())
    await wait(4122, 10121);
  }

  async isAuthenticated(): Promise<boolean> {
    return !await getButtonByText(this.page, 'connect wallet')
  }

  async signIn(): Promise<void> {
    const signInButton = await getButtonByText(this.page, 'connect wallet', {searchContainerSelector: '.sticky'});

    if (!signInButton) {
      throw new Error('Sign-in button not found')
    }

    await hoverAndClick(signInButton)
    await wait(1211, 3121);

    const metaMaskButton = await getButtonByText(this.page, 'metamask', {
      searchContainerSelector: 'div[role="dialog"]'
    });

    if (!metaMaskButton) {
      throw new Error('Metamask button not found')
    }

    await hoverAndClick(metaMaskButton)

    const metaMaskPage = await Metamask.waitForExtensionOpen(this.browser)
    await wait(1111, 2222);

    const nextBtn = await getButtonByText(metaMaskPage, 'next', {searchContainerSelector: 'footer'})

    if (!nextBtn) {
      throw new Error('Sign in. Next button not found')
    }

    await hoverAndClick(nextBtn);
    await wait(1111, 2222);

    const confirmBtn = await getButtonByText(metaMaskPage, 'confirm', {searchContainerSelector: 'footer'})

    if (!confirmBtn) {
      throw new Error('Confirm button not found')
    }

    await hoverAndClick(confirmBtn);
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
    const metamaskPage = await Metamask.waitForExtensionOpen(this.browser)
    await wait(5211, 8121);
    await Metamask.signTransaction(metamaskPage, {maxGasFee: 0.1})

    await this.page.waitForFunction(
      (btn) => !btn.isConnected,
      {},
      claimBtn
    );
  }
}

export default IdaoJob;
