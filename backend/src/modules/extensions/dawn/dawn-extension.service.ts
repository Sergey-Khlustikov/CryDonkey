import ExtensionAbstract from '@src/modules/extensions/extension.abstract.js';
import { Injectable } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';

@Injectable()
export class DawnExtensionService extends ExtensionAbstract {
  constructor() {
    super('fpdkjdnhkakefebpekbdhillbhonfjjp', 'Dawn');
  }

  async openDashboardPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    page.on('dialog', async (dialog) => await dialog.accept());
    await page.goto(`chrome-extension://${this.getId()}/pages/dashboard.html`);

    return page;
  }
}
