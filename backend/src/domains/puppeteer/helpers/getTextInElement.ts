import {ElementHandle, Page} from "puppeteer";

async function getTextInElement(page: Page, element: ElementHandle): Promise<string> {
  return page.evaluate(el => el.textContent || '', element);
}

export default getTextInElement;
