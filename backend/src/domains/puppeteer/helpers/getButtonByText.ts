import {ElementHandle, Page} from "puppeteer";
import PGetElementByText, {IGetByTextOptions} from "#src/domains/puppeteer/helpers/PGetElementByText.js";

async function getButtonByText(
  page: Page,
  text: string,
  {
    containerSelector = 'html',
    elementSelector = 'button',
    strict = true
  }: IGetByTextOptions = {}): Promise<ElementHandle | null> {
  return PGetElementByText(page, text, {containerSelector, elementSelector, strict});
}

export default getButtonByText;
