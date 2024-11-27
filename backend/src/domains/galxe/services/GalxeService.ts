import {Browser, Page} from "puppeteer";
import EGalxeConnectMethods from "#src/domains/galxe/structures/EGalxeConnectMethods.js";
import PClearCookies from "#src/domains/puppeteer/helpers/PClearCookies.js";
import PClearLocalStorage from "#src/domains/puppeteer/helpers/PClearLocalStorage.js";
import getButtonByText from "#src/domains/puppeteer/helpers/getButtonByText.js";
import {hoverAndClick, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import PGetClosetParentOfElement from "#src/domains/puppeteer/helpers/PGetClosetParentOfElement.js";
import PGetElementByText from "#src/domains/puppeteer/helpers/PGetElementByText.js";
import Rabby from "#src/domains/extensions/rabby/Rabby.js";

class GalxeService {
  public baseUrl: string = 'https://app.galxe.com/';

  async openPage(browser: Browser, url?: string): Promise<Page> {
    const page = await browser.newPage();
    await page.goto(url || this.baseUrl, {waitUntil: 'networkidle2', timeout: 60000});

    return page;
  }

  async isAuthenticated(page: Page): Promise<boolean> {
    try {
      const cookies = await page.cookies();
      const authToken = cookies.find(cookie => cookie.name === 'auth-token');

      return !!authToken;
    } catch (e) {
      throw e;
    }
  }

  async getConnectMethod(page: Page): Promise<string | null> {
    const cookies = await page.cookies();
    const cookie = cookies.find(cookie => cookie.name === 'connectMethod');

    if (!cookie) {
      return null;
    }

    return cookie.value
  }

  async authenticateWithRabby(browser: Browser, page: Page): Promise<Page> {
    if (await this.isAuthenticated(page)) {
      if (await this.getConnectMethod(page) === EGalxeConnectMethods.Rabby) {
        return page;
      }

      await PClearCookies(page);
      await PClearLocalStorage(page)
      await page.reload({waitUntil: 'networkidle2', timeout: 60000});
    }

    const logInBtn = await getButtonByText(page, 'log in')

    if (!logInBtn) {
      throw new Error('Galxe. Log in btn not found')
    }

    await hoverAndClick(logInBtn);

    const popupSelector = 'div[role="dialog"][data-state="open"]'
    await page.waitForSelector(popupSelector)
    await wait(3122, 6012);

    const rabbyElement = await PGetElementByText(page, 'rabby', {containerSelector: popupSelector});

    if (!rabbyElement) {
      throw new Error('Galxe. Rabby element not found.')
    }

    const rabbyBtn = await PGetClosetParentOfElement(rabbyElement, '.cursor-pointer')

    if (!rabbyBtn) {
      throw new Error('Galxe. Rabby btn not found.')
    }

    await hoverAndClick(rabbyBtn);

    const rabbyPage = await Rabby.waitForExtensionOpen(browser)
    await Rabby.connectToSite(browser, rabbyPage)
    await page.bringToFront();

    return page;
  }
}

export default new GalxeService();
