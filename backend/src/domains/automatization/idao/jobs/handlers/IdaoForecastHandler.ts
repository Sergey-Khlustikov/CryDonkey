import {Browser, Page} from "puppeteer";
import getRandomArrayElement from "#src/helpers/getRandomArrayElement.js";
import {hoverAndClick, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import normalizeString from "#src/helpers/normalizeString.js";
import getTextInElement from "#src/domains/puppeteer/helpers/getTextInElement.js";
import typeWithRandomDelay from "#src/domains/puppeteer/helpers/typeWithRandomDelay.js";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js";
import getRandomNumberBetween from "#src/helpers/getRandomNumberBetween.js";
import getButtonByText from "#src/domains/puppeteer/helpers/getButtonByText.js";
import Metamask from "#src/domains/extensions/metamask/Metamask.js";

type TCurrencyPair = 'BTC/USD' | 'ETH/USD' | 'BNB/USD' | 'XRP/USD' | 'SOL/USD';
type TShortTermTimelines = '1 hour' | '4 hours' | '12 hours';

class IdaoForecastHandler {
  protected browser: Browser
  protected page: Page
  protected forecastOptions: IIdaoForecastOptions
  private forecastPairs: TCurrencyPair[] = ['BTC/USD', 'ETH/USD', 'BNB/USD', 'XRP/USD', 'SOL/USD']
  private shortTermTimelines: TShortTermTimelines[] = ['1 hour', '4 hours', '12 hours']

  constructor(browser: Browser, page: Page, forecastOptions: IIdaoForecastOptions) {
    this.browser = browser
    this.page = page
    this.forecastOptions = forecastOptions
  }

  async run() {
    if (await this.slotsAvailable('Short-Term')) {
      await this.runShortTerm();
    }
  }

  async slotsAvailable(term: string) {
    return !!await this.getAvailableSlotsCount(term);
  }

  async getAvailableSlotsCount(term: string): Promise<number> {
    const selector = 'xpath/.//div[contains(text(), "' + term + '")]/following-sibling::div//div';
    const availableSlotElements = await this.page.$$(selector);

    if (!availableSlotElements || availableSlotElements.length === 0) {
      throw new Error('Error in parsing available slots');
    }

    const slotText = await getTextInElement(this.page, availableSlotElements[0]);
    const [left] = slotText.split('/').map(Number);

    return left;
  }

  async runShortTerm() {
    let availableSlots = await this.getAvailableSlotsCount('Short-Term')

    while (availableSlots > 0) {
      const randomPair = getRandomArrayElement(this.forecastPairs)
      const randomTimeline = getRandomArrayElement(this.shortTermTimelines)

      await this.pickTradingPair(randomPair)
      await wait(1412, 5121);
      await this.pickTimeline(randomTimeline)
      await wait(1412, 7121);
      await this.setForecastPrice()
      await wait(2112, 5112);
      await this.makeForecast();
      await wait(1231, 5121);
      availableSlots--;
    }
  }

  async pickTradingPair(pair: TCurrencyPair): Promise<void> {
    const selector = 'xpath/.//div[contains(text(), "Select COIN")]/following-sibling::div//div[contains(@class, "cursor-pointer")]';
    const [openPairsModalBtn] = await this.page.$$(selector);

    if (!openPairsModalBtn) {
      throw new Error('Select COIN btn not found');
    }

    if (normalizeString(await getTextInElement(this.page, openPairsModalBtn)) === normalizeString(pair)) {
      return;
    }

    await hoverAndClick(openPairsModalBtn)
    const modalSelector = '#headlessui-portal-root';
    await this.page.waitForSelector(modalSelector)
    await wait(1216, 5212)

    await this.pickOptionInModal(pair, `${modalSelector} .cursor-pointer`)
  }

  async pickTimeline(timeline: TShortTermTimelines): Promise<void> {
    const selector = 'xpath/.//div[contains(text(), "Choose horizon")]/following-sibling::div//div[contains(@class, "cursor-pointer")]';
    const [openTimelineModalBtn] = await this.page.$$(selector);

    if (!openTimelineModalBtn) {
      throw new Error('Choose horizon element not found');
    }

    if (normalizeString(await getTextInElement(this.page, openTimelineModalBtn)) === normalizeString(timeline)) {
      return;
    }

    await hoverAndClick(openTimelineModalBtn)
    const modalSelector = '#headlessui-portal-root';
    await this.page.waitForSelector(modalSelector)
    await wait(1216, 5212)

    await this.pickOptionInModal(timeline, `${modalSelector} .cursor-pointer`)
  }

  async pickOptionInModal(option: TCurrencyPair | TShortTermTimelines, optionsSelector: string): Promise<void> {
    const optionElements = await this.page.$$(optionsSelector);

    for (const optionElement of optionElements) {
      const textContent = await getTextInElement(this.page, optionElement);

      if (normalizeString(textContent) === normalizeString(option)) {
        await hoverAndClick(optionElement);
        return;
      }
    }

    throw new Error(`Option ${option} not found`);
  }

  async setForecastPrice() {
    const selector = 'xpath/.//div[contains(text(), "Set target price")]/following-sibling::div//input';
    const [inputElement] = await this.page.$$(selector);

    if (!inputElement) {
      throw new Error('Set target price input not found');
    }

    const inputValue = await this.page.evaluate(input => (input as HTMLInputElement).value, inputElement);
    const currentPrice = parseFloat(inputValue);
    const targetPriceDeviation = getRandomNumberBetween(
      this.forecastOptions.minTargetPriceDeviation,
      this.forecastOptions.maxTargetPriceDeviation,
      {withDecimals: true}
    );

    if (targetPriceDeviation === 0 && currentPrice > 0) {
      return;
    }

    const sign = Math.random() < 0.5 ? -1 : 1;
    const newPrice = currentPrice + sign * currentPrice * (targetPriceDeviation / 100);
    const newPriceStr = newPrice.toFixed(inputValue.includes('.') ? 2 : 0);

    await inputElement.click({count: 3})
    await typeWithRandomDelay(this.page, selector, newPriceStr)
  }

  async makeForecast() {
    const forecastBtn = await getButtonByText(this.page, 'Make forecast');

    if (!forecastBtn) {
      throw new Error('Make forecast button not found');
    }

    await hoverAndClick(forecastBtn)
    const metamaskPage = await Metamask.waitForPageOpen(this.browser)
    await wait(1211, 3121);
    await Metamask.signTransaction(metamaskPage, {maxGasFee: 0.1})
  }
}

export default IdaoForecastHandler
