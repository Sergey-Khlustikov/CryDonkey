import {Browser, Page, Target} from "puppeteer";
import triggerBrowserExtension from "#src/domains/puppeteer/helpers/triggerBrowserExtension.js";

class Extension {
  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
  }

  getId() {
    return this.id;
  }

  async waitForExtensionOpen(browser: Browser, timeout: number = 15000): Promise<Page> {
    let resultPromise: (page: Page | Promise<Page>) => void;
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise<Page>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Timeout waiting for the ${this.name} to open`));
      }, timeout);
    });

    async function onTargetCreatedHandler(target: Target) {
      if (target.type() === 'page') {
        const newPage = await target.page();

        if (newPage === null) {
          throw new Error(`newPage was null`);
        }

        const newPagePromise = new Promise<Page>((resolve) =>
          newPage.once('domcontentloaded', () => {
            resolve(newPage);
          })
        );

        const isPageLoaded = await newPage.evaluate(() => document.readyState);

        browser.off('targetcreated', onTargetCreatedHandler);

        if (isPageLoaded.match('complete|interactive')) {
          clearTimeout(timeoutId);
          return resultPromise(newPage);
        } else {
          clearTimeout(timeoutId);
          return resultPromise(newPagePromise);
        }
      }
    }

    return Promise.race([
      new Promise<Page>((resolve) => {
        resultPromise = resolve;
        browser.on('targetcreated', onTargetCreatedHandler);
      }),
      timeoutPromise
    ]);
  }

  async triggerExtension(browser: Browser, page: Page) {
    return triggerBrowserExtension(browser, page, this.getId());
  }
}

export default Extension;
