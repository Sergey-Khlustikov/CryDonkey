import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {Browser, Page} from "puppeteer";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import Dawn from "#src/domains/extensions/dawn/Dawn.js";
import {minimizeBrowser, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import minuteToMs from "#src/helpers/minuteToMs.js";

class DawnCheckAuthJob {
  protected job: IJobBulk;
  protected profile: { id: string, name: string };
  protected page!: Page;
  protected browser!: Browser;

  constructor(job: IJobBulk) {
    const {profile} = job.data;

    this.job = job;
    this.profile = profile;
  }

  async run(): Promise<void> {
    try {
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id);

      try {
        await this.start(browser);
      } finally {
        await this.page.close();
        await minimizeBrowser(browser)
      }
    } catch (e) {
      throw e;
    }
  }

  async start(browser: Browser): Promise<void> {
    this.browser = browser;
    this.page = await Dawn.openDashboardPage(this.browser);

    this.page.on('dialog', async (dialog) => await dialog.accept());

    await wait(5000, 5000)

    if (await this.page.$('input#email')) {
      throw new Error('Not logged in');
    }

    const selector = '#dawnbalance';
    const timeout = minuteToMs(1);

    await this.page.waitForSelector(selector, {timeout});
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && element.textContent && element.textContent.trim().length > 0;
      },
      {timeout},
      selector
    );
  }
}

export default DawnCheckAuthJob;
