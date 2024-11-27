import {hoverAndClick, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import ENV from "#src/structures/env.js";
import {Browser, Page} from "puppeteer";
import Extension from "#src/domains/extensions/Extension.js";
import getButtonByText from "#src/domains/puppeteer/helpers/getButtonByText.js";
import PWaitForBtnActivated from "#src/domains/puppeteer/helpers/PWaitForBtnActivated.js";

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

  async connectToSite(browser: Browser, page: Page) {
    await page.waitForNavigation({waitUntil: 'networkidle2'})
    const connectBtn = await getButtonByText(page, 'connect');

    if (!connectBtn) {
      throw new Error('Rabby/connectToSite. Connect btn not found');
    }

    await PWaitForBtnActivated(page, connectBtn);
    await hoverAndClick(connectBtn)

    page = await this.waitForExtensionOpen(browser)
    await page.waitForNavigation({waitUntil: 'networkidle2'})
    await wait(3122, 6012);

    const signBtn = await getButtonByText(page, 'sign')

    if (!signBtn) {
      throw new Error('Rabby/connectToSite. Sign btn not found.')
    }

    await PWaitForBtnActivated(page, signBtn)
    await hoverAndClick(signBtn);
    await wait(1211, 2102);

    const confirmBtn = await getButtonByText(page, 'confirm');

    if (!confirmBtn) {
      throw new Error('Rabby/connectToSite. Confirm btn not found');
    }

    await PWaitForBtnActivated(page, confirmBtn);
    await hoverAndClick(confirmBtn)
    await wait(1211, 2102);
  }
}

export default new Rabby();
