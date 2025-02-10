import { ElementHandle, Frame, Page } from 'puppeteer';

async function getTextInElement(
  page: Page | Frame,
  element: ElementHandle,
): Promise<string> {
  return page.evaluate((el) => el.textContent || '', element);
}

export default getTextInElement;
