import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {hoverAndClick, minimizeBrowser, wait} from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import getRandomArrayElement from "#src/helpers/getRandomArrayElement.js";
import PageScroller from "#src/domains/puppeteer/helpers/PageScroller.js";
import SwanDailyTaskHandler from "#src/domains/swan/jobs/handlers/SwanDailyTaskHandler.js";
import SwanSocialQuestsHandler from "#src/domains/swan/jobs/handlers/SwanSocialQuestsHandler.js";
import SwanOnChainQuestsHandler from "#src/domains/swan/jobs/handlers/SwanOnChainQuestsHandler.js";
import {retryMethodWithReload} from '#src/helpers/retryMethod.js';
import {Browser, Page} from "puppeteer";
import getButtonByText from "#src/domains/puppeteer/helpers/getButtonByText.js";
import {Job} from "bullmq";
import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";

class SwanJob {
  private job: Job;
  private profile: IBaseJobProfile;
  private onlyDaily: boolean;
  private keepOpenProfileIds: string[];
  private questUrl: string = 'https://mission.swanchain.io/'

  private DailyTaskHandler: SwanDailyTaskHandler;
  private CommonQuestsHandler: SwanSocialQuestsHandler;
  private OnChainQuestsHandler: SwanOnChainQuestsHandler;

  constructor(job: Job, {profile, onlyDaily, dailyCombo, commentQuests, keepOpenProfileIds, commentAutomationType}) {
    this.job = job;
    this.profile = profile;
    this.onlyDaily = onlyDaily;
    this.keepOpenProfileIds = keepOpenProfileIds;

    this.DailyTaskHandler = new SwanDailyTaskHandler(job, {dailyCombo});
    this.CommonQuestsHandler = new SwanSocialQuestsHandler({
      commentAutomationType, commentQuests,
    });
    this.OnChainQuestsHandler = new SwanOnChainQuestsHandler();
  }

  async run() {
    try {
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id);

      try {
        await this.startQuests(browser);
      } finally {
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        } else {
          await minimizeBrowser(browser)
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async startQuests(browser: Browser) {
    const page = await browser.newPage();
    await page.goto(this.questUrl, {waitUntil: 'networkidle2'});

    await wait(1012, 5012);

    if (!(await this.isAuthenticated(page))) {
      await this.signIn(browser, page)
      await wait(1231, 5123);
    }

    const scenario = getRandomArrayElement([1, 2, 3]);

    await this.runScenario({browser, page, scenario});
  }

  async isAuthenticated(page: Page) {
    return !(await page.$('.title-signup'))
  }

  async signIn(browser: Browser, page: Page) {
    const connectBtn = await getButtonByText(page, 'CONNECT', {buttonTag: 'div'});

    if (!connectBtn) {
      throw new Error('Connect btn not found')
    }

    await hoverAndClick(connectBtn);

    await page.waitForNavigation({waitUntil: 'networkidle2'});

    await wait(3421, 6012);  // Пауза перед кликом на авторизацию
    console.log('twitter ok')
    console.log('wait for nav ok')
    const authBtn = await page.$('#allow')

    if (!authBtn) {
      throw new Error('Auth btn not found')
    }
    console.log('btn ok')
    await hoverAndClick(authBtn)

    await page.waitForNavigation({waitUntil: 'networkidle2'});
  }

  async runScenario({browser, page, scenario}) {
    const socialMissionsTabBtn = await page.locator('#tab-SocialMission');
    await hoverAndClick(socialMissionsTabBtn);

    const scroller = new PageScroller({page, scrollableTag: '.el-main'});

    try {
      switch (scenario) {
        case 1:
          await scroller.scrollToElementCenter('.reward-card');
          await wait(1214, 3521);
          await this.DailyTaskHandler.run(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElementCenter('.reward-card');
            await wait(1214, 3521);
            await this.CommonQuestsHandler.run(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await retryMethodWithReload(page, () => this.OnChainQuestsHandler.run(browser, page));
          await wait(1452, 5312);

          break;

        case 2:
          if (!this.onlyDaily) {
            await scroller.scrollToElementCenter('.task-all');
            await wait(1214, 3521);
            await this.CommonQuestsHandler.run(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToElementCenter('.reward-card', {
            minDistance: 102,
            maxDistance: 423,
          });

          await wait(1214, 3521);
          await this.DailyTaskHandler.run(page);
          await wait(1214, 3521);

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await retryMethodWithReload(page, () => this.OnChainQuestsHandler.run(browser, page));
          await wait(1452, 5312);

          break;

        case 3:
          await scroller.scrollToBottom({
            minDistance: 102,
            maxDistance: 523,
          });
          await wait(1214, 3521);
          await scroller.scrollToElementCenter('.reward-card', {
            minDistance: 102,
            maxDistance: 523,
          });

          await wait(1214, 3521);
          await this.DailyTaskHandler.run(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElementCenter('.reward-card');
            await wait(1214, 3521);
            await this.CommonQuestsHandler.run(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await retryMethodWithReload(page, () => this.OnChainQuestsHandler.run(browser, page));
          await wait(1452, 5312);

          break;
      }
    } catch (e) {
      throw e;
    } finally {
      await page.close();
    }
  }
}

export default SwanJob;
