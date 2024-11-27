import {ElementHandle, Page} from "puppeteer";
import normalizeString from "#src/helpers/normalizeString.js";
import getTextInElement from "#src/domains/puppeteer/helpers/getTextInElement.js";

export interface IGetByTextOptions {
  containerSelector?: string;
  elementSelector?: string;
  strict?: boolean;
  removeSpaces?: boolean;
}

async function PGetElementByText(
  page: Page,
  text: string,
  {
    containerSelector = 'html',
    elementSelector,
    strict = true,
    removeSpaces = true,
  }: IGetByTextOptions = {}
): Promise<ElementHandle | null> {

  const elements = elementSelector
    ? await page.$$(`${containerSelector} ${elementSelector}`)
    : await page.$$(`${containerSelector} *`);

  for (const element of elements) {
    const elementText = normalizeString(await getTextInElement(page, element), {removeSpaces: removeSpaces});
    const normalizedSearchText = normalizeString(text, {removeSpaces: removeSpaces});

    if (
      (strict && elementText === normalizedSearchText) ||
      (!strict && elementText.includes(normalizedSearchText))
    ) {
      return element;
    }
  }

  return null;
}

export default PGetElementByText;
