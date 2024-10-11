import {wait} from '../../../../../automatization/helpers/puppeteerHelpers';

class BlumJobWeeklyHandler {
  constructor(browser, tgPage, blumFrame) {
    this.browser = browser;
    this.blumFrame = blumFrame;
    this.tgPage = tgPage;
  }

  async run() {
    try {
      await this.blumFrame.locator('.layout-tabs a[href="/tasks"]').click();
      await wait(2123, 4121);

      await this.completeSocialTasks();

    } catch (e) {
      throw e;
    }
  }

  async completeSocialTasks() {
    const socialCard = await this.findSocialTasksCard();

    if (await this.socialTasksDone(socialCard)) {
      return;
    }

    await this.processSocialTasks(socialCard);
  }

  async findSocialTasksCard() {
    let weeklyCard;
    const tasks = await this.blumFrame.$$('.pages-tasks-item');

    for (const task of tasks) {
      const title = await task.$eval('.title', el => el.innerText.trim());

      if (title === 'Earn for checking socials') {
        weeklyCard = task;
        break;
      }
    }

    if (!weeklyCard) {
      throw new Error('Weekly card is not found');
    }

    return weeklyCard;
  }

  async socialTasksDone(weeklyCard) {
    const doneIcon = await weeklyCard.$('.footer .done-icon');

    if (doneIcon) {
      return true;
    }

    const progressElement = await weeklyCard.$('.pages-tasks-progress-pill .label');
    const progress = await progressElement.evaluate(el => el.innerText.trim());

    return progress.split('/')[0] === progress.split('/')[1];
  }

  async processSocialTasks(socialCard) {
    try {
      const openBtn = await socialCard.$('button.tasks-pill-inline');
      await openBtn.click();

      await socialCard.waitForSelector('.kit-bottom-sheet dialog');
      await wait(2122, 5123);

      const tasks = await this.getNotCompletedTasks();

      for (let task of tasks) {
        await this.processWeeklySocialTask(task);
      }
    } catch (e) {
      throw e;
    }
  }

  async processWeeklySocialTask(task) {
    const pageTarget = this.tgPage.target();
    const titleEl = await task.$('.title');
    const title = await titleEl.evaluate(el => el.innerText.trim());

    const actionBtnEl = await task.$('.pill-btn');
    const actionBtnText = await actionBtnEl.evaluate(el => el.innerText.trim());

    if (actionBtnText === 'Claim') {
      await actionBtnEl.click();
    }

    if (actionBtnText === 'Start') {
      if (title.toLowerCase().includes('telegram')) {
        await actionBtnEl.click();
        await wait(1012, 2312);
        throw new Error('restart');
      }

      await actionBtnEl.click();

      const newTarget = await this.browser.waitForTarget(target => target.opener() === pageTarget);
      const newPage = await newTarget.page();

      if (newPage) {
        await wait(1421, 3012);
        await newPage.close();
      }

      await this.tgPage.bringToFront();

      await this.blumFrame.waitForFunction(
        (btn) => btn.innerText.trim() === 'Claim',
        {timeout: 30000},
        actionBtnEl,
      );

      await wait(1212, 3120);

      await actionBtnEl.click();
    }

    await wait(2012, 5121);
  }

  async getNotCompletedTasks() {
    const tasks = await this.blumFrame.$$('.pages-tasks-subtasks-modal .nested-tasks > .pages-tasks-list-item-label');

    const notCompletedTasks = [];

    for (const task of tasks) {
      const isFinished = await task.$('button.is-status-finished');

      if (!isFinished) {
        notCompletedTasks.push(task);
      }
    }

    return notCompletedTasks;
  }
}

export default BlumJobWeeklyHandler;
