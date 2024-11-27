import {ElementHandle, Page} from "puppeteer";
import normalizeString from "#src/helpers/normalizeString.js";
import getTextInElement from "#src/domains/puppeteer/helpers/getTextInElement.js";
import {IGetByTextOptions} from "#src/domains/puppeteer/helpers/PGetElementByText.js";

async function PGetElementByText(
  page: Page,
  text: string | string[],
  {
    containerSelector = 'html',
    elementSelector,
    strict = true,
    removeSpaces = true,
  }: IGetByTextOptions = {}
): Promise<ElementHandle[] | null> {

  const elements = elementSelector
    ? await page.$$(`${containerSelector} ${elementSelector}`)
    : await page.$$(`${containerSelector} *`);

  const matched = []

  const normalizedSearchText = typeof text === 'string'
    ? [normalizeString(text, {removeSpaces: removeSpaces})]
    : text.map(t => normalizeString(t, {removeSpaces: removeSpaces}));

  for (const element of elements) {
    const elementText = normalizeString(await getTextInElement(page, element), {removeSpaces: removeSpaces});

    const isMatch = normalizedSearchText.some(searchText =>
      (strict && elementText === searchText) ||
      (!strict && elementText.includes(searchText))
    );

    if (isMatch) {
      matched.push(element);
    }
  }

  return matched.length ? matched : null;
}

export default PGetElementByText;
