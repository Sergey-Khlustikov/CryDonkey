import { hoverAndClick, wait } from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import ENV from '#src/structures/env.js';
import { Browser, Page } from 'puppeteer';
import Extension from '#src/domains/extensions/Extension.js';
import extractNumbersFromString from '#src/helpers/extractNumbersFromString.js';
import getTextInElement from '#src/domains/puppeteer/helpers/getTextInElement.js';
import getButtonByText from '#src/domains/puppeteer/helpers/getButtonByText.js';

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

  async signTransaction(page: Page, options: { maxGasFee: number }): Promise<void> {
    await page.waitForSelector('div.approval');
    await wait(1011, 2110);

    const gasValueElement = await page.$('.gas-selector-card-amount span.text-r-blue-default');

    if (!gasValueElement) {
      throw new Error('Rabby: Could not find gas element');
    }

    const gasValueUsd = extractNumbersFromString(await getTextInElement(page, gasValueElement));

    if (gasValueUsd > options.maxGasFee) {
      throw new Error(`Rabby: Gas is too high. Max desired gas: ${options.maxGasFee}. Actual gas: ${gasValueUsd}`);
    }

    const signBtn = await getButtonByText(page, 'Sign');

    if (!signBtn) {
      throw new Error('Rabby: Confirm btn not found.');
    }

    await hoverAndClick(signBtn);
    await wait(1011, 2110);

    const confirmBtn = await getButtonByText(page, 'Confirm');

    if (!confirmBtn) {
      throw new Error('Rabby: Confirm btn not found.');
    }

    await hoverAndClick(confirmBtn);
  }
}

export default new Rabby();
