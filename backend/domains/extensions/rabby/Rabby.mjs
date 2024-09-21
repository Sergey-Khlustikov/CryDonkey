import { wait } from '../../../automatization/helpers/puppeteerHelpers.mjs';
import ENV from '../../../structures/env.mjs';
import triggerBrowserExtension from '../../../automatization/helpers/triggerBrowserExtension.mjs';

class Rabby {
  getId() {
    return 'acmacodkjbdgmoleebolmdjonilkdbch';
  }

  async unlockFullPage(browser) {
    const loginUrl = `chrome-extension://${this.getId()}/index.html#/unlock`;
    const page = await browser.newPage();

    try {
      await page.goto(loginUrl, { waitUntil: 'load' });

      await page.waitForSelector('body');

      if (page.$('.unlock')) {
        await wait(1211, 2102);
        await page.locator('#password').fill(ENV.RABBY_PASSWORD);
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

  async trigger(browser, page) {
    return triggerBrowserExtension(browser, page, this.getId());
  }
}

export default new Rabby();
