import AdsApi from '../../../api/AdsApi.mjs';
import { wait } from '../../../automatization/helpers/puppeteerHelpers.mjs';
import getRandomArrayElement from '../../../automatization/helpers/getRandomArrayElement.mjs';
import PageScroller from '../../../automatization/helpers/PageScroller.mjs';
import SwanDailyTaskHandler from './handlers/SwanDailyTaskHandler.mjs';
import SwanSocialQuestsHandler from './handlers/SwanSocialQuestsHandler.mjs';
import SwanOnChainQuestsHandler from './handlers/SwanOnChainQuestsHandler.mjs';
import { retryMethodWithReload } from '../../../helpers/retryMethod.mjs';

class SwanJob {
  constructor(job, { profile, onlyDaily, dailyCombo, commentQuests, keepOpenProfileIds, commentAutomationType }) {
    this.job = job;
    this.profile = profile;
    this.onlyDaily = onlyDaily;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.questUrl = 'https://mission.swanchain.io/';

    this.DailyTaskHandler = new SwanDailyTaskHandler(job, { dailyCombo });
    this.CommonQuestsHandler = new SwanSocialQuestsHandler({
      commentAutomationType, commentQuests,
    });
    this.OnChainQuestsHandler = new SwanOnChainQuestsHandler();
  }

  async run() {
    try {
      console.log(`------- Start profile ${this.profile.name} -------`);
      const browser = await AdsApi.connectToPuppeteer(this.profile.id);

      try {
        await this.startQuests(browser);
      } finally {
        console.log(`------- Stop profile ${this.profile.name} --------`);
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async startQuests(browser) {
    const page = await browser.newPage();
    await page.goto(this.questUrl, { waitUntil: 'networkidle2' });

    await wait(1012, 5012);

    const scenario = getRandomArrayElement([1, 2, 3]);

    await this.runScenario({browser, page, scenario});
  }

  async runScenario({ browser, page, scenario }) {
    const scroller = new PageScroller({ page, scrollableTag: '.el-main' });
    console.log(`run scenario ${scenario}`);

    try {
      switch (scenario) {
        case 1:
          await scroller.scrollToElement('.community-boost');
          await wait(1214, 3521);
          await this.DailyTaskHandler.run(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElementCenter('.task-all');
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

          await scroller.scrollToElement('.total-referral', {
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
          await scroller.scrollToElement('.total-referral', {
            minDistance: 102,
            maxDistance: 523,
          });

          await wait(1214, 3521);
          await this.DailyTaskHandler.run(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElementCenter('.task-all');
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
