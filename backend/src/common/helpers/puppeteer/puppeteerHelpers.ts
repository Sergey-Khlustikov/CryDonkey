import { Browser, ElementHandle, Locator } from 'puppeteer';

export function wait(minMs: number, maxMs: number) {
  const waitTime = Math.random() * (maxMs - minMs) + minMs;

  return new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
}

interface IHoverClickable {
  hover(options?: any): Promise<void>;

  click(options?: any): Promise<void>;
}

export async function hoverAndClick(
  locator: ElementHandle | Locator<Element>,
): Promise<void> {
  const el = locator as unknown as IHoverClickable;
  await el.hover();
  await wait(405, 1421);
  await el.click();
}

export async function minimizeBrowser(browser: Browser) {
  const page = await browser.newPage();
  const session = await page.createCDPSession();
  const { windowId } = await session.send('Browser.getWindowForTarget');

  await session.send('Browser.setWindowBounds', {
    windowId,
    bounds: { windowState: 'minimized' },
  });

  await page.close();
}
