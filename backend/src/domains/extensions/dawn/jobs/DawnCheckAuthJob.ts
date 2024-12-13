import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {Browser, Page} from "puppeteer";
import Dawn from "#src/domains/extensions/dawn/Dawn.js";
import {minimizeBrowser, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import minuteToMs from "#src/helpers/minuteToMs.js";
import accountsData from "#src/domains/extensions/dawn/structures/accountsData.js";
import {Job, UnrecoverableError} from "bullmq";

class DawnCheckAuthJob {
  protected job: Job;
  protected profile: { id: string, name: string };
  protected page!: Page;
  protected browser!: Browser;

  constructor(job: Job) {
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
      await this.fillForm()
      throw new UnrecoverableError('Not authorized');
    }

    try {
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
    } catch (e) {
      throw e
    } finally {
      await this.page.close()
    }
  }

  async fillForm() {
    const accountData = accountsData.find(data => {
      return data.profileId === this.profile.id;
    })

    if (!accountData) {
      throw new Error('Could not find account data');
    }

    const emailInput = await this.page.$('input#email')
    await emailInput?.type(accountData.email)

    const passwordInput = await this.page.$('input#password')
    await passwordInput?.type(accountData.password)
  }
}

export default DawnCheckAuthJob;
