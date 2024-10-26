import {Browser, ElementHandle} from "puppeteer";

export function wait(minMs: number, maxMs: number) {
  const waitTime = Math.random() * (maxMs - minMs) + minMs;

  return new Promise(resolve => { setTimeout(resolve, waitTime); });
}

export async function hoverAndClick(locator: ElementHandle) {
  await locator.hover();
  await wait(405, 1421);
  await locator.click();
}

export async function minimizeBrowser(browser: Browser) {
  const page = await browser.newPage();
  const session = await page.createCDPSession();
  const {windowId} = await session.send('Browser.getWindowForTarget');

  await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

  await page.close();
}
