import Extension from "#src/domains/extensions/Extension.js";
import {Browser, Page} from "puppeteer";

class Dawn extends Extension {
  constructor() {
    super('fpdkjdnhkakefebpekbdhillbhonfjjp', 'Dawn');
  }

  async openDashboardPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    await page.goto(`chrome-extension://${this.getId()}/dashboard.html`);

    return page;
  }
}

export default new Dawn();
