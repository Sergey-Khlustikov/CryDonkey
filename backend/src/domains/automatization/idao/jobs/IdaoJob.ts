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
    await this.claimPoints();
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

    const metaMaskPage = await Metamask.waitForPageOpen(this.browser)
    await wait(1111, 2222);
    await hoverAndClick(await getButtonByText(metaMaskPage, 'next', {searchContainerSelector: 'footer'}))
    await wait(1111, 2222);
    await hoverAndClick(await getButtonByText(metaMaskPage, 'confirm', {searchContainerSelector: 'footer'}))

  }

  async claimPoints() {
    const pageScroller = new PageScroller({page: this.page, scrollableTag: 'html'});
    await pageScroller.scrollToBottom();
    await wait(3121, 6121);

    const claimBtn = await getButtonByText(this.page, 'claim', {strict: false});

    if (!claimBtn) {
      return
    }

    await hoverAndClick(claimBtn)
    const metamaskPage = await Metamask.waitForPageOpen(this.browser)
    await wait(5211, 8121);
    await Metamask.signTransaction(metamaskPage, {maxGasFee: 0.1})
  }
}

export default IdaoJob;
