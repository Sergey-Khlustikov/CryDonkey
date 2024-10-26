import {Browser, Page} from "puppeteer";

async function triggerBrowserExtension(browser: Browser, page: Page, id: string): Promise<void> {
  const extBackgroundTarget = await browser.waitForTarget(
    target => target.type() === 'service_worker' && target.url().includes(id),
  );

  const extWorker = await extBackgroundTarget.worker();

  await page.bringToFront();

  if (!extWorker) {
    return
  }

  await extWorker.evaluate(() => {
    // @ts-ignore
    chrome.action.openPopup();
  });
}

export default triggerBrowserExtension;
