// @ts-nocheck
import {hoverAndClick, wait} from "#src/domains/puppeteer/helpers/puppeteerHelpers.js";
import PageScroller from "#src/domains/puppeteer/helpers/PageScroller.js";
import Rabby from "#src/domains/extensions/rabby/Rabby.js";

class SwanOnChainQuestsHandler {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async run(browser, page) {
    console.log('Start onchain');
    try {
      this.browser = browser;
      this.page = page;
      const scroller = new PageScroller({page, scrollableTag: '.el-main'});

      await Rabby.unlockFullPage(this.browser);
      this.page.bringToFront();

      const onChainTabBtn = page.locator('#tab-OnchainMission');
      await hoverAndClick(onChainTabBtn);
      await wait(1241, 3120);
      await scroller.scrollToBottom({minDistance: 102, maxDistance: 523});

      const quests = await page.$$('.interact-container-card .item');

      if (quests.length === 0) {
        return;
      }

      for (let quest of quests) {
        await this.processQuest(quest);
      }
      console.log('end onchain');
    } catch (e) {
      throw e;
    }
  }

  async processQuest(quest) {
    const taskTitleElement = await quest.$('.item-title span');

    if (!taskTitleElement) {
      return;
    }

    const taskTitle = await this.page.evaluate(el => el.textContent, taskTitleElement);
    if (taskTitle === 'Daily Check-in') {
      await this.completeDailyQuest(quest);
    }

    if (taskTitle === 'Daily Mint') {
      await this.completeDailyMint(quest);
    }
  }

  async completeDailyQuest(task) {
    try {
      const verifyBtn = await task.$('.item-title-right .btn:last-of-type');

      if (!verifyBtn) {
        throw new Error('On chain daily check in. Verify btn not found.');
      }

      const buttonText = await verifyBtn.evaluate(el => el.innerText.trim());

      if (buttonText === 'Done' || buttonText === 'Verifying') {
        return;
      }

      if (buttonText === 'Verify') {
        await hoverAndClick(verifyBtn);
      } else {
        return;
      }

      await this.processRabby();

    } catch (error) {
      console.error('Error occurred:', error);
      console.error('Error name:', error.name);
      throw error;
    }
  }

  async completeDailyMint(quest) {
    console.log('start mint');
    try {
      const verifyBtn = await quest.$('.item-title-right .btn:last-of-type');

      if (!verifyBtn) {
        throw new Error('On chain daily mint. Verify btn not found.');
      }
      console.log('verifyBtn', verifyBtn);
      const buttonText = await verifyBtn.evaluate(el => el.innerText.trim());
      console.log('mint.', buttonText);
      if (buttonText === 'Done' || buttonText === 'Verifying') {
        return;
      }

      if (buttonText === 'Verify') {
        const arrowBtn = await quest.$('.el-collapse-item__arrow');
        await hoverAndClick(arrowBtn);
        await wait(2123, 4127);
        const openNftModalBtn = await quest.$('.swan-nft');
        await hoverAndClick(openNftModalBtn);

        await this.page.waitForSelector('.nft-container');
        await wait(2013, 5064);

        const mintBtn = await this.page
          .locator('.nft-container .btn')
          .filter(button => button.innerText.trim().toLowerCase() === 'mint');

        if (!mintBtn) {
          throw new Error('On chain daily mint. Mint button not found.');
        }

        await hoverAndClick(mintBtn);
        await this.processRabby();
        await wait(2013, 5064);
        await hoverAndClick(verifyBtn);
        await wait(1522, 4313);
      }

    } catch (e) {
      console.error('Error occurred:', e);
      console.error('Error name:', e.name);
      throw e;
    }
  }

  async processRabby() {
    console.log('try open rabby');
    const newPagePromise = new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page())));
    await wait(4912, 8124);
    const extensionPage = await newPagePromise;

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
  }
}

export default SwanOnChainQuestsHandler;
