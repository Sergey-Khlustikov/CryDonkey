import {ElementHandle, Page} from "puppeteer";
import getTextInElement from "#src/domains/puppeteer/helpers/getTextInElement";
import normalizeString from "#src/helpers/normalizeString";

interface IOptions {
  searchContainerSelector?: string;
  buttonTag?: string;
  strict?: boolean;
}

async function getButtonByText(
  page: Page,
  text: string,
  {
    searchContainerSelector = 'html',
    buttonTag = 'button',
    strict = true
  }: IOptions = {}): Promise<ElementHandle | null> {
  const buttons = await page.$$(`${searchContainerSelector} ${buttonTag}`);

  for (const button of buttons) {
    const buttonText = normalizeString(await getTextInElement(page, button));
    const normalizedSearchText = normalizeString(text)

    if (
      buttonText === normalizedSearchText
      || (!strict && buttonText.includes(normalizedSearchText))
    ) {
      return button;
    }
  }
  return null;
}

export default getButtonByText;
