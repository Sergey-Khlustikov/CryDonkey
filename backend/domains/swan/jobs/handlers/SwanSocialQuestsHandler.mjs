import TASK_TYPES from '../../structures/taskTypes.mjs';
import SWAN_COMMENT_AUTOMATION_TYPES from '../../structures/SwanCommentAutomationTypes.mjs';
import { hoverAndClick, wait } from '../../../../automatization/helpers/puppeteerHelpers.mjs';
import OpenAIApi from '../../../../api/OpenAIApi.mjs';
import typeWithRandomDelay from '../../../../automatization/helpers/typeWithRandomDelay.mjs';
import { retryMethod } from '../../../../helpers/retryMethod.mjs';
import checkTwitterAuth from '../../../../automatization/helpers/checkTwitterAuth.mjs';

class SwanSocialQuestsHandler {
  constructor({commentAutomationType, commentQuests}) {
    this.commentAutomationType = commentAutomationType;
    this.commentQuests = commentQuests;
    this.browser = null;
    this.page = null;
  }

  async run(browser, page) {
    console.log('Start Social quests');
    try {
      this.browser = browser;
      this.page = page;

      const quests = await this.getQuests();

      if (quests.length === 0) {
        return;
      }

      for (let quest of quests) {
        await this.processQuest(quest);
      }
    } catch (e) {
      throw e;
    }

    console.log('End Social quests');
  }

  async getQuests() {
    return this.page.$$('.tasks:first-of-type .tasks-list.item');
  }

  async processQuest(task) {
    console.log('Start single quest');
    try {
      const taskTitleElement = await task.$('.title-url');

      if (!taskTitleElement) {
        return;
      }

      const taskTitle = await this.getTaskTitle(taskTitleElement);
      const taskType = this.getTaskType(taskTitle);

      if (!taskType) {
        return;
      }

      await this.handleQuest(taskTitleElement, taskType, task);

      await this.verifyTaskCompletion(task);
    } catch (e) {
      throw e;
    }
    console.log('End single quest');
  }

  async getTaskTitle(taskTitleElement) {
    return this.page.evaluate(el => el.textContent.trim(), taskTitleElement);
  }

  getTaskType(taskTitle) {
    const taskTitleFirstWord = taskTitle.toLowerCase().trim().split(' ')[0];

    switch (taskTitleFirstWord) {
      case 'follow':
        return TASK_TYPES.follow;
      case 'like':
        return TASK_TYPES.like;
      case 'repost':
        return TASK_TYPES.repost;
      case 'comment':
        return this.commentAutomationType === SWAN_COMMENT_AUTOMATION_TYPES.skip ? null : TASK_TYPES.comment;
      default:
        return null;
    }
  }

  async handleQuest(taskTitleElement, taskType) {
    try {
      const twitterPage = await retryMethod(() => this.openTwitterPage(taskTitleElement));

      if (twitterPage) {
        await wait(2041, 5123);
        await this.processTwitterTask(twitterPage, taskType, taskTitleElement);
      }

      await this.page.bringToFront();
      await wait(1021, 3712);
    } catch (e) {
      throw e;
    }
  }

  async hoverAndClickTask(taskTitleElement) {
    await taskTitleElement.hover();
    await wait(141, 953);
    await taskTitleElement.click();
  }

  async openTwitterPage(taskTitleElement) {
    try {
      console.log('try hover and click');
      await this.hoverAndClickTask(taskTitleElement);
      console.log('hover and click successful');

      const pageTarget = this.page.target();
      console.log('wait for twitter page');
      const twitterTarget = await this.browser.waitForTarget(target => target.opener() === pageTarget);
      const twitterPage = await twitterTarget.page();

      if (twitterPage) {
        await twitterPage.waitForNavigation({waitUntil: 'networkidle2'});
        await wait(3421, 6012);
      }

      if (twitterPage && !(await checkTwitterAuth(twitterPage))) {
        throw new Error('Twitter login failed.');
      }

      console.log('Twitter page ok');
      return twitterPage;
    } catch (e) {
      throw e;
    }
  }

  async processTwitterTask(twitterPage, taskType, taskTitle) {
    try {
      switch (taskType) {
        case TASK_TYPES.follow:
          await this.handleTwitterAction(twitterPage, 'Follow');
          break;
        case TASK_TYPES.like:
          await this.handleTwitterAction(twitterPage, 'Like');
          break;
        case TASK_TYPES.repost:
          await this.handleTwitterAction(twitterPage, 'Repost');
          break;
        case TASK_TYPES.comment:
          await this.processCommentTask(twitterPage, taskTitle);
          break;
      }
    } finally {
      await twitterPage.close();
    }
  }

  async handleTwitterAction(page, actionText) {
    const btn = await page.$(`button::-p-text(${actionText})`);

    if (btn) {
      await hoverAndClick(btn);
      await wait(2121, 4912);
    } else {
      throw new Error(`${actionText} button not found`);
    }
  }

  async processCommentTask(page, taskTitle) {
    let comment = await this.getComment(taskTitle);
    await this.commentTwitterPost(page, comment);
  }

  async getComment(taskTitle) {
    if (this.commentAutomationType === SWAN_COMMENT_AUTOMATION_TYPES.manual) {
      const commentQuest = this.commentQuests.find(quest => quest.title === taskTitle);
      return commentQuest?.comment || await this.getAIComment();
    } else {
      return await this.getAIComment();
    }
  }

  async getAIComment(page) {
    const postElement = await page.$('div[data-testid="tweetText"]');
    const postElementText = await page.evaluate(el => el.textContent, postElement);

    const userMessage = `"${postElementText}"\nGenerate short neutral response to this twitter post. No emojis, only short response, 1 sentence.`;

    return OpenAIApi.generateMessage(userMessage);
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

  async verifyTaskCompletion(task) {
    const verifyBtn = await task.$('.tasks-btn');
    await hoverAndClick(verifyBtn);
    await wait(2163, 4601);
    console.log('task verified btn clicked');
  }
}

export default SwanSocialQuestsHandler;
