import {hoverAndClick, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import ENV from "#src/structures/env.js";
import {Browser, Page} from "puppeteer";
import PageScroller from "#src/domains/puppeteer/helpers/PageScroller.js";
import getTextInElement from "#src/domains/puppeteer/helpers/getTextInElement.js";
import extractNumbersFromString from "#src/helpers/extractNumbersFromString.js";

class Metamask {
  private id: string = 'nkbihfbeogaeaoehlefnkodbefgpgknn';

  async unlockFullPage(browser: Browser): Promise<void> {
    const loginUrl = `chrome-extension://${this.id}/home.html#unlock`;
    const page: Page = await browser.newPage();

    try {
      await page.goto(loginUrl, {waitUntil: 'networkidle2'});
      await wait(5000, 6000)

      if (await page.$('.unlock-page')) {
        await wait(1211, 2102);

        await page.waitForSelector('#password')
        await page.type('#password', ENV.RABBY_PASSWORD);
        await wait(1211, 2102);

        await page.click('button[data-testid="unlock-submit"]');
        await wait(1211, 2102);
      }

      if (!await page.waitForSelector('.wallet-overview')) {
        throw new Error('Failed to unlock Metamask wallet.');
      }
    } finally {
      await page.close();
    }
  }

  async waitForPageOpen(browser: Browser, timeout: number = 10000): Promise<Page> {
    return new Promise((resolve, reject) => {
      let resolved = false;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          reject(new Error('MetaMask page did not open within the specified time'));
        }
      }, timeout);

      browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
          try {
            const page = await target.page();

            if (page) {
              await page.waitForNavigation({waitUntil: 'networkidle2', timeout});
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve(page);
              }
            }
          } catch (error) {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutId);
              reject(error);
            }
          }
        }
      });
    });
  }

  async signTransaction(page: Page, options: { maxGasFee: number }): Promise<void> {
    const pageScroller = new PageScroller({page, scrollableTag: 'div[style*="overflow: auto"]'})
    await pageScroller.scrollToBottom()
    await wait(1011, 2110);

    const gasValueElement = await page.$('p[data-testid="native-currency"]');

    if (!gasValueElement) {
      throw new Error('Matamask: Could not find gas element');
    }

    const gasValueUsd = extractNumbersFromString(await getTextInElement(page, gasValueElement));

    if (gasValueUsd > options.maxGasFee) {
      throw new Error(`Matamask: Gas is too high. Max desired gas: ${options.maxGasFee}. Actual gas: ${gasValueUsd}`);
    }

    const confirmBtn = await page.$('button[data-testid="confirm-footer-button"]');

    if (!confirmBtn) {
      throw new Error('Matamask: Confirm btn not found.');
    }

    await hoverAndClick(confirmBtn);
  }
}

export default new Metamask();
