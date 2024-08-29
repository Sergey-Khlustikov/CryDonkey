import getRandomArrayElement from '../helpers/getRandomArrayElement.mjs';
import { hoverAndClick, wait } from '../helpers/puppeteerHelpers.mjs';
import TASK_TYPES from './structures/taskTypes.mjs';
import PageScroller from '../helpers/PageScroller.mjs';
import AdsApi from '../../api/AdsApi.mjs';
import typeWithRandomDelay from '../helpers/typeWithRandomDelay.mjs';

export async function run(data) {
  try {
    const browser = await AdsApi.connectToPuppeteer(data.profile.id);

    try {
      await startQuests({ ...data, browser });
    } finally {
      if (!data.keepOpenProfileIds.includes(data.profile.id)) {
        await browser.close();
      }
    }
  } catch (e) {
    throw e;
  }
}

export async function startQuests({ browser, dailyCombo, onlyDaily, commentQuests }) {
  const questsUrl = 'https://mission.swanchain.io/';
  const page = await browser.newPage();
  await page.goto(questsUrl, { waitUntil: 'load' });

  await wait(1012, 5012);

  const scenario = getRandomArrayElement([1, 2, 3]);

  await runScenario({
    page, browser, scenario, dailyCombo, onlyDaily, commentQuests,
  });
}

async function runScenario({ page, browser, scenario, dailyCombo, onlyDaily, commentQuests }) {
  const scroller = new PageScroller({ page, scrollableTag: '.el-main' });

  try {
    switch (scenario) {
      case 1:
        await scroller.scrollToElement('.total-referral');
        await wait(1214, 3521);
        await completeDailyQuest(page, dailyCombo);
        await wait(1214, 3521);

        if (!onlyDaily) {
          await scroller.scrollToElement('.task-all');
          await wait(1214, 3521);
          await completeCommonQuests(browser, page, commentQuests);
          await wait(1214, 3521);
        }

        break;

      case 2:
        if (!onlyDaily) {
          await scroller.scrollToElement('.task-all');
          await wait(1214, 3521);
          await completeCommonQuests(browser, page, commentQuests);
          await wait(1214, 3521);
        }

        await scroller.scrollToElement('.total-referral', {
          minDistance: 102,
          maxDistance: 423,
        });

        await wait(1214, 3521);
        await completeDailyQuest(page, dailyCombo);
        await wait(1214, 3521);
        break;

      case 3:
        await scroller.scrollToElement('.faq', {
          minDistance: 102,
          maxDistance: 523,
        });
        await wait(1214, 3521);
        await scroller.scrollToElement('.total-referral', {
          minDistance: 102,
          maxDistance: 523,
        });

        await wait(1214, 3521);
        await completeDailyQuest(page, dailyCombo);
        await wait(1214, 3521);

        if (!onlyDaily) {
          await scroller.scrollToElement('.task-all');
          await wait(1214, 3521);
          await completeCommonQuests(browser, page, commentQuests);
          await wait(1214, 3521);
        }

        break;

      default:
        throw new Error('Unsupported scenario');
    }
  } catch (e) {
    throw e;
  } finally {
    await page.close();
  }
}

async function completeDailyQuest(page, dailyCombo) {
  if ((await page.$('.reward-card .reward-card-btn')) === null) {
    return;
  }

  const startDailyBtn = await page.locator('.reward-card .reward-card-btn');
  await startDailyBtn.wait();
  await hoverAndClick(startDailyBtn);
  await page.waitForSelector('.daliy-card .random-container');

  await wait(2027, 4126);
  await clickDailyNumber(page, dailyCombo.first);
  await wait(1027, 3126);
  await clickDailyNumber(page, dailyCombo.second);
  await wait(1027, 3126);
  await clickDailyNumber(page, dailyCombo.third);
  await wait(1027, 3126);

  await hoverAndClick(await page.locator('.daliy-card .confirm-btn'));
  await wait(4027, 7126);
  await hoverAndClick(await page.locator('.daliy-card .close-btn'));
}

async function clickDailyNumber(page, number) {
  const element = await page.$(`.random-image${number}`);

  if (!element) {
    throw new Error('Daily number image not found.');
  }

  await element.click();
}

async function completeCommonQuests(browser, page, commentQuests) {
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
      await twitterPage.waitForNavigation({ waitUntil: 'load' });
      await wait(3421, 6012);
      await processTwitter(twitterPage, taskType, taskTitle, commentQuests);
      await twitterPage.close();
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

async function processTwitter(page, taskType, taskTitle, commentQuests) {
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
    const commentQuest = commentQuests.find(quest => quest.title === taskTitle);

    if (!commentQuest) {
      return;
    }

    await commentTwitterPost(page, commentQuest.comment);
  }

  await wait(1027, 3261);
}

async function commentTwitterPost(page, comment) {
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
