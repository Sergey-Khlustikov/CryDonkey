import {wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import ENV from "#src/structures/env.js";
import {Browser} from "puppeteer";
import Extension from "#src/domains/extensions/Extension.js";

class Rabby extends Extension {
  constructor() {
    super('acmacodkjbdgmoleebolmdjonilkdbch', 'Rabby');
  }

  async unlockFullPage(browser: Browser) {
    const loginUrl = `chrome-extension://${this.getId()}/index.html#/unlock`;
    const page = await browser.newPage();

    try {
      await page.goto(loginUrl, { waitUntil: 'load' });

      await page.waitForSelector('body');

      if (await page.$('.unlock')) {
        await wait(1211, 2102);
        await page.locator('#password').fill(ENV.RABBY_PASSWORD.trim());
        await wait(1211, 2102);
        await page.locator('button[type=submit]').click();
        await wait(1211, 2102);
      }
    } catch (e) {
      throw new Error('Failed to unlock Rabby wallet.');
    } finally {
      await page.close();
    }
  }
}

export default new Rabby();
