import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import {Browser, ElementHandle, Page} from "puppeteer";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import GalxeService from "#src/domains/galxe/services/GalxeService.js";

class IdaoJob {
  protected job: IJobBulk;
  protected profile: IBaseJobProfile;
  protected questUrl: string;
  protected page!: Page;
  protected browser!: Browser;
  protected part: string;
  private keepOpenProfileIds: string[];

  constructor(job: IJobBulk) {
    const {profile, keepOpenProfileIds, part} = job.data;

    this.job = job;
    this.profile = profile;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.part = part
    this.questUrl = 'https://app.galxe.com/quest/peaq/GCug8tVVJL/';
  }

  async run(): Promise<void> {
    try {
      this.browser = await AdsPowerService.connectToPuppeteer(this.profile.id);
      this.page = await GalxeService.openPage(this.browser);

      try {
        await this.startQuests();
      } finally {
        // await this.page.close();

        // if (!this.keepOpenProfileIds.includes(this.profile.id)) {
        //   await this.browser.close();
        // } else {
        //   await minimizeBrowser(this.browser)
        // }
      }
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  async startQuests(): Promise<void> {
    this.page = await GalxeService.authenticateWithRabby(this.browser, this.page)
    await this.page.goto(this.questUrl, {waitUntil: 'networkidle2'});

    const questBlocks = await this.page.$$('div.rounded-lg.overflow-hidden.flex');

    for (const questBlock of questBlocks) {
      if (await this.questBlockHasActiveTwitterQuests(questBlock)) {
        const twitterQuestElements = await this.getActiveTwitterTaskElements(questBlock);
      }
    }
  }

  async getActiveTwitterTaskElements(block: ElementHandle): Promise<ElementHandle[]> {
    const activeElements: ElementHandle[] = [];

    const questElements = await block.$$('div.text-left.cursor-pointer[type="button"]');

    for (const element of questElements) {
      if (await this.isActiveTwitterTask(element)) {
        activeElements.push(element);
      }
    }

    return activeElements;
  }

  async questBlockHasActiveTwitterQuests(block: ElementHandle): Promise<boolean> {
    const questElements = await block.$$('div.text-left.cursor-pointer[type="button"]');

    for (const element of questElements) {
      if (await this.isActiveTwitterTask(element)) {
        return true;
      }
    }

    return false;
  }

  async isActiveTwitterTask(element: ElementHandle): Promise<boolean> {
    const elementText = await element.evaluate(el => el.textContent?.toLowerCase() || '');

    if (['like', 'follow', 'retweet'].some(action => elementText.includes(action))) {
      const buttonWithSuccessClass = await element.$('button .text-success');

      return !buttonWithSuccessClass;
    }

    return false;
  }
}

export default IdaoJob;
