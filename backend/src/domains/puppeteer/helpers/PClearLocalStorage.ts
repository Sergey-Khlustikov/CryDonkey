import {Page} from "puppeteer";

async function PClearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

export default PClearLocalStorage;
