import {
  hoverAndClick,
  wait,
} from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import { Browser, Page } from 'puppeteer';
import PageScroller from '../../../common/helpers/puppeteer/PageScroller.js';
import getTextInElement from '../../../common/helpers/puppeteer/getTextInElement.js';
import extractNumbersFromString from '../../../common/helpers/extractNumbersFromString.js';
import ExtensionAbstract from '@src/modules/extensions/extension.abstract.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetamaskService extends ExtensionAbstract {
  constructor(protected configService: ConfigService) {
    super('nkbihfbeogaeaoehlefnkodbefgpgknn', 'Metamask');
  }

  async unlockFullPage(browser: Browser): Promise<void> {
    const loginUrl = `chrome-extension://${this.getId()}/home.html#unlock`;
    const page: Page = await browser.newPage();

    try {
      await page.goto(loginUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('.loading-logo', { hidden: true });

      if (await page.$('.unlock-page')) {
        await page.waitForSelector('#password', { timeout: 10000 });
        await page.type('#password', this.configService.get('RABBY_PASSWORD'));
        await wait(1211, 2102);

        await page.click('button[data-testid="unlock-submit"]');
      }

      await page.waitForSelector('.wallet-overview', { timeout: 10000 });
    } catch (e) {
      throw new Error(`Failed to unlock Metamask wallet. Error: ${e}`);
    } finally {
      await page.close();
    }
  }

  async signTransaction(
    page: Page,
    options: { maxGasFee: number },
  ): Promise<void> {
    await page.waitForSelector('div[data-testid="confirm-header"]');

    const pageScroller = new PageScroller({
      page,
      scrollableTag: 'div[style*="overflow: auto"]',
    });
    await pageScroller.scrollToBottom();
    await wait(1011, 2110);

    const gasValueElement = await page.$('p[data-testid="native-currency"]');

    if (!gasValueElement) {
      throw new Error('Matamask: Could not find gas element');
    }

    const gasValueUsd = extractNumbersFromString(
      await getTextInElement(page, gasValueElement),
    );

    if (gasValueUsd > options.maxGasFee) {
      throw new Error(
        `Matamask: Gas is too high. Max desired gas: ${options.maxGasFee}. Actual gas: ${gasValueUsd}`,
      );
    }

    const confirmBtn = await page.$(
      'button[data-testid="confirm-footer-button"]',
    );

    if (!confirmBtn) {
      throw new Error('Matamask: Confirm btn not found.');
    }

    await hoverAndClick(confirmBtn);
  }
}
