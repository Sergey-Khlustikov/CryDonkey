import { hoverAndClick, wait } from '../../../../automatization/helpers/puppeteerHelpers.mjs';
import PageScroller from '../../../../automatization/helpers/PageScroller.mjs';
import Rabby from '../../../extensions/rabby/Rabby.mjs';

class SwanOnChainQuestsHandler {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async run(browser, page) {
    console.log('Start onchain');
    // find extension background target and load the page

    try {
      this.browser = browser;
      this.page = page;
      const scroller = new PageScroller({ page, scrollableTag: '.el-main' });

      await Rabby.unlockFullPage(this.browser);
      this.page.bringToFront();
      await Rabby.trigger(this.browser, this.page);

      const onChainTabBtn = page.locator('#tab-OnchainMission');
      await hoverAndClick(onChainTabBtn);
      await wait(1241, 3120);
      await scroller.scrollToBottom({ minDistance: 102, maxDistance: 523 });

      const tasks = await page.$$('.interact-container-card');

      if (tasks.length === 0) {
        return;
      }

      for (let task of tasks) {
        const taskTitleElement = await task.$('.item-title span');

        if (!taskTitleElement) {
          continue;
        }

        const taskTitle = await page.evaluate(el => el.textContent, taskTitleElement);

        if (taskTitle === 'Daily Check-in') {
          await this.completeDailyQuest(task);
        }
      }
      console.log('end onchain');
    } catch (e) {
      throw e;
    }
  }

  async completeDailyQuest(task) {
    try {
      const verifyBtn = await task.$('.item-title-right .btn:last-of-type');

      if (!verifyBtn) {
        throw new Error('Onchain daily. Verify btn not found.');
      }

      const buttonText = await verifyBtn.evaluate(el => el.innerText.trim());
      console.log(buttonText);
      if (buttonText === 'Verify') {
        await hoverAndClick(verifyBtn);
      } else {
        return;
      }

      console.log('try open rabby');
      const newPagePromise = new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page())));
      const extensionPage = await newPagePromise;

      await extensionPage.waitForNavigation({ waitUntil: 'load' });
      console.log('rabby opened');

      await wait(5024, 8123);

      await extensionPage.waitForSelector('button');
      await extensionPage
        .locator('button')
        .filter(button => button.innerText === 'Sign')
        .click();

      await wait(2121, 5121);

      await extensionPage.waitForSelector('button');
      await extensionPage
        .locator('button')
        .filter(button => button.innerText === 'Confirm')
        .click();

      await wait(1021, 3712);

    } catch (error) {
      console.error('Error occurred:', error);
      console.error('Error name:', error.name);
      throw error;
    }
  }
}

export default SwanOnChainQuestsHandler;
