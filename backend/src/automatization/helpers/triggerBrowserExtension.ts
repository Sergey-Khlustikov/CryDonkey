import {Browser, Page} from "puppeteer";

async function triggerBrowserExtension(browser: Browser, page: Page, id: string): Promise<void> {
  const extBackgroundTarget = await browser.waitForTarget(
    target => target.type() === 'service_worker' && target.url().includes(id),
  );

  const extWorker = await extBackgroundTarget.worker();

  await page.bringToFront();

  // @ts-ignore
  await extWorker.evaluate(() => {
    // chrome.action.openPopup();
  });
}

export default triggerBrowserExtension;
