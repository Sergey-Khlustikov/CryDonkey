import AdsApi from '../../../api/AdsApi.mjs';
import {hoverAndClick, wait} from '../../../automatization/helpers/puppeteerHelpers.mjs';
import getRandomArrayElement from '../../../automatization/helpers/getRandomArrayElement.mjs';
import PageScroller from '../../../automatization/helpers/PageScroller.mjs';
import TASK_TYPES from '../../../automatization/swan/structures/taskTypes.mjs';
import typeWithRandomDelay from '../../../automatization/helpers/typeWithRandomDelay.mjs';
import SWAN_COMMENT_AUTOMATION_TYPES from '../structures/SwanCommentAutomationTypes.mjs';
import OpenAIApi from '../../../api/OpenAIApi.mjs';
import unlockRabbyWallet from '../../../automatization/helpers/unlockRabbyWallet.mjs';

class SwanJob {
  constructor({profile, onlyDaily, dailyCombo, commentQuests, keepOpenProfileIds, commentAutomationType}) {
    this.profile = profile;
    this.onlyDaily = onlyDaily;
    this.dailyCombo = dailyCombo;
    this.commentQuests = commentQuests;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.commentAutomationType = commentAutomationType;
    this.questUrl = 'https://mission.swanchain.io/';
  }

  async run() {
    try {
      const browser = await AdsApi.connectToPuppeteer(this.profile.id);

      try {
        await this.startQuests(browser);
      } finally {
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
    await page.goto(this.questUrl, {waitUntil: 'load'});

    await wait(1012, 5012);

    const scenario = getRandomArrayElement([1, 2, 3]);

    await this.runScenario({browser, page, scenario: 1});
  }

  async runScenario({browser, page, scenario}) {
    const scroller = new PageScroller({page, scrollableTag: '.el-main'});

    try {
      switch (scenario) {
        case 1:
          await scroller.scrollToElement('.total-referral');
          await wait(1214, 3521);
          await this.completeDailyQuest(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElement('.reward-card');
            await wait(1214, 3521);
            await this.completeCommonQuests(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await this.completeOnChainTasks(browser, page, scroller);
          await wait(1452, 5312);

          break;

        case 2:
          if (!this.onlyDaily) {
            await scroller.scrollToElement('.reward-card');
            await wait(1214, 3521);
            await this.completeCommonQuests(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToElement('.total-referral', {
            minDistance: 102,
            maxDistance: 423,
          });

          await wait(1214, 3521);
          await this.completeDailyQuest(page);
          await wait(1214, 3521);

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await this.completeOnChainTasks(browser, page, scroller);
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
          await this.completeDailyQuest(page);
          await wait(1214, 3521);

          if (!this.onlyDaily) {
            await scroller.scrollToElement('.reward-card');
            await wait(1214, 3521);
            await this.completeCommonQuests(browser, page);
            await wait(1214, 3521);
          }

          await scroller.scrollToTop();
          await wait(1452, 5312);
          await this.completeOnChainTasks(browser, page, scroller);
          await wait(1452, 5312);

          break;
      }
    } catch (e) {
      throw e;
    } finally {
      await page.close();
    }
  }

  async completeOnChainTasks(browser, page, scroller) {
    await unlockRabbyWallet(browser);

    const onChainTabBtn = page.locator('#tab-OnchainMission');
    await hoverAndClick(onChainTabBtn);
    await wait(1241, 3120);
    await scroller.scrollToBottom({minDistance: 102, maxDistance: 523});

    const tasks = await page.$$('.interact-container-card');

    if (tasks.length === 0) {
      return;
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskTitleElement = await task.$('.item-title span');

      if (!taskTitleElement) {
        continue;
      }

      const taskTitle = await page.evaluate(el => el.textContent, taskTitleElement);

      if (taskTitle === 'Daily Check-in') {
        const verifyBtn = await task.$('.item-title-right .btn:last-of-type');

        if (!verifyBtn) {
          throw new Error('Onchain daily. Verify btn not found.');
        }

        const buttonText = await verifyBtn.evaluate(el => el.innerText.trim());
        console.log(buttonText);
        if (buttonText === 'Verify') {
          await hoverAndClick(verifyBtn);
        } else {
          continue;
        }

        const newPagePromise = new Promise(resolve => browser.once('targetcreated', target => resolve(target.page())));
        const extensionPage = await newPagePromise;

        await wait(2024, 5123);

        await extensionPage
          .locator('button')
          .filter(button => button.innerText === 'Sign')
          .click();

        await wait(2121, 5121);

        await extensionPage
          .locator('button')
          .filter(button => button.innerText === 'Confirm')
          .click();

        await wait(2121, 5121);
      }
    }
  }

  async completeDailyQuest(page) {
    if ((await page.$('.reward-card .reward-card-btn')) === null) {
      return;
    }

    const startDailyBtn = await page.locator('.reward-card .reward-card-btn');
    await startDailyBtn.wait();
    await hoverAndClick(startDailyBtn);
    await page.waitForSelector('.daliy-card .random-container');

    await wait(2027, 4126);
    await this.clickDailyNumber(page, this.dailyCombo.first);
    await wait(1027, 3126);
    await this.clickDailyNumber(page, this.dailyCombo.second);
    await wait(1027, 3126);
    await this.clickDailyNumber(page, this.dailyCombo.third);
    await wait(1027, 3126);

    await hoverAndClick(await page.locator('.daliy-card .confirm-btn'));
    await wait(4027, 7126);
    await hoverAndClick(await page.locator('.daliy-card .close-btn'));
  }

  async clickDailyNumber(page, number) {
    const element = await page.$(`.random-image${number}`);

    if (!element) {
      throw new Error('Daily number image not found.');
    }

    await element.click();
  }

  async completeCommonQuests(browser, page) {
    const pageTarget = page.target();
    const tasks = await page.$$('.tasks:first-of-type .tasks-list.item');

    if (tasks.length === 0) {
      return;
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskTitleElement = await task.$('.title-url');

      if (!taskTitleElement) {
        continue;
      }

      const taskTitle = await page.evaluate(el => el.textContent.trim(), taskTitleElement);
      let taskType;

      const taskTitleFirstWord = taskTitle
        .toLowerCase()
        .trim()
        .split(' ')[0];

      if (taskTitleFirstWord === 'follow') {
        taskType = TASK_TYPES.follow;
      } else if (taskTitleFirstWord === 'like') {
        taskType = TASK_TYPES.like;
      } else if (taskTitleFirstWord === 'repost') {
        taskType = TASK_TYPES.repost;
      } else if (taskTitleFirstWord === 'comment') {
        if (this.commentAutomationType === SWAN_COMMENT_AUTOMATION_TYPES.skip) {
          continue;
        }

        taskType = TASK_TYPES.comment;
      } else {
        continue;
      }

      await taskTitleElement.hover();
      await wait(141, 953);
      await taskTitleElement.click();

      const twitterTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      const twitterPage = await twitterTarget.page();

      if (twitterPage) {
        try {
          await twitterPage.waitForNavigation({waitUntil: 'load'});
          await wait(3421, 6012);
          await this.processTwitter(twitterPage, taskType, taskTitle);
        } finally {
          await twitterPage.close();
        }
      }

      await page.bringToFront();
      await wait(1021, 3712);

      const verifyBtn = await task.$('.tasks-btn');
      verifyBtn.hover();
      await wait(152, 563);
      verifyBtn.click();
      await wait(2163, 4601);
    }
  }

  async processTwitter(page, taskType, taskTitle) {
    if (taskType === TASK_TYPES.follow) {
      const btn = await page.$('button::-p-text(Follow)');

      if (btn) {
        await hoverAndClick(btn);
      } else {
        throw new Error('Follow button not found');
      }
    }

    if (taskType === TASK_TYPES.like) {
      const btn = await page.$('button::-p-text(Like)');

      if (btn) {
        await hoverAndClick(btn);
      } else {
        throw new Error('Like button not found');
      }
    }

    if (taskType === TASK_TYPES.repost) {
      const btn = await page.$('button::-p-text(Repost)');

      if (btn) {
        await hoverAndClick(btn);
      } else {
        throw new Error('Repost button not found');
      }
    }

    if (taskType === TASK_TYPES.comment) {
      await this.processCommentTask(page, taskTitle);
    }

    await wait(1027, 3261);
  }

  async processCommentTask(page, taskTitle) {
    let comment;

    if (this.commentAutomationType === SWAN_COMMENT_AUTOMATION_TYPES.manual) {
      const commentQuest = this.commentQuests.find(quest => quest.title === taskTitle);

      comment = commentQuest?.comment;
    }

    if (!comment) {
      comment = await this.getAIComment(page);
    }

    await this.commentTwitterPost(page, comment);
  }

  async getAIComment(page) {
    const postElement = await page.$('div[data-testid="tweetText"]');
    const postElementText = await page.evaluate(el => el.textContent, postElement);

    let userMessage = `"${postElementText}"\n`;
    userMessage += 'Generate short neutral response to this twitter post. No emojis, only short response, 1 sentence.';

    return await OpenAIApi.generateMessage(userMessage);
  }

  async commentTwitterPost(page, comment) {
    const textareaSelector = '.public-DraftStyleDefault-ltr > span';
    await page.locator(textareaSelector).wait();
    await typeWithRandomDelay(page, textareaSelector, comment);

    const btn = await page.$('button[data-testid="tweetButton"]');

    if (btn) {
      await hoverAndClick(btn);
    } else {
      throw new Error('Reply button not found');
    }
  }
}

export default SwanJob;
