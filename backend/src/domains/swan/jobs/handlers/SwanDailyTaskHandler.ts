// @ts-nocheck
import {hoverAndClick, wait} from '#src/automatization/helpers/puppeteerHelpers.js';

class SwanDailyTaskHandler {
  constructor(job, {dailyCombo}) {
    this.job = job;
    this.dailyCombo = dailyCombo;
    this.page = null;
  }

  async run(page) {
    try {
      if (this.job.data.swanDailyDone) {
        return;
      }

      this.page = page;
      console.log('Start daily');
      if ((await this.page.$('.reward-card .reward-card-btn')) === null) {
        return;
      }

      const startDailyBtn = await this.page.locator('.reward-card .reward-card-btn');
      await startDailyBtn.wait();
      await hoverAndClick(startDailyBtn);
      await this.page.waitForSelector('.daliy-card .random-container');

      await wait(2027, 4126);
      await this.clickNumber(this.page, this.dailyCombo.first);
      await wait(1027, 3126);
      await this.clickNumber(this.page, this.dailyCombo.second);
      await wait(1027, 3126);
      await this.clickNumber(this.page, this.dailyCombo.third);
      await wait(1027, 3126);

      await hoverAndClick(await this.page.locator('.daliy-card .confirm-btn'));
      await wait(4027, 7126);
      await hoverAndClick(await this.page.locator('.daliy-card .close-btn'));

      this.job.updateData({...this.job.data, swanDailyDone: true});
      console.log('End daily');
    } catch (e) {
      throw e;
    }
  }

  async clickNumber(page, number) {
    const element = await page.$(`.random-image${number}`);

    if (!element) {
      throw new Error('Daily number image not found.');
    }

    await element.click();
  }
}

export default SwanDailyTaskHandler;
