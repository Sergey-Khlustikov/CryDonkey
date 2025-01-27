import { ElementHandle, Frame, Page } from 'puppeteer';
import getTextInElement from '@src/common/helpers/puppeteer/getTextInElement.js';
import normalizeString from '@src/common/helpers/normalizeString.js';

interface IOptions {
  searchContainerSelector?: string;
  buttonTag?: string;
  strict?: boolean;
}

async function getButtonByText(
  page: Page | Frame,
  text: string,
  {
    searchContainerSelector = 'html',
    buttonTag = 'button',
    strict = true,
  }: IOptions = {},
): Promise<ElementHandle | null> {
  const buttons = await page.$$(`${searchContainerSelector} ${buttonTag}`);

  for (const button of buttons) {
    const buttonText = normalizeString(await getTextInElement(page, button));
    const normalizedSearchText = normalizeString(text);

    if (
      buttonText === normalizedSearchText ||
      (!strict && buttonText.includes(normalizedSearchText))
    ) {
      return button;
    }
  }
  return null;
}

export default getButtonByText;
