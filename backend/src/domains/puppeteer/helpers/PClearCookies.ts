import {Page} from "puppeteer";

async function PClearCookies(page: Page): Promise<void> {
  const client = await page.createCDPSession()
  await client.send('Network.clearBrowserCookies')
}

export default PClearCookies;
