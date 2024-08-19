const axios = require('axios');
const puppeteer = require('puppeteer');
const TASK_TYPES = require('backend/automatization/swan/structures/taskTypes');
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const getRandomArrayElement = require('backend/automatization/helpers/getRandomArrayElement');
const PageScroller = require('backend/automatization/helpers/PageScroller');
const {
  hoverAndClick,
  scrollPage,
  wait,
} = require('../helpers/puppeteerHelpers.js');

// Вспомогательная функция для записи логов в файл
async function logToFile(message) {
  try {
    const logPath = path.join(app.getPath('userData'), 'log.txt');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    await fs.promises.appendFile(logPath, logMessage, 'utf8');
  } catch (err) {
    console.error('Failed to write log to file:', err);
  }
}

async function run({
  profileIds,
  dailyFirst,
  dailySecond,
  dailyThird,
  onlyDaily,
}) {
  try {
    const dailyCombo = {
      dailyFirst,
      dailySecond,
      dailyThird,
    };

    for (let i = 0; i < profileIds.length; i++) {
      await openProfile(profileIds[i], dailyCombo, onlyDaily);

      if (i !== profileIds.length - 1) {
        await wait(60000, 200000);
      }
    }
  } catch (e) {
    logToFile(`Error in run: ${e.message}`);
    console.log('Error in run', e);
  }
}

async function openProfile(userId, dailyCombo, onlyDaily) {
  logToFile(`--------- Start profile id ${userId} ---------`);
  console.log(`--------- Start profile id ${userId} ---------`);
  const questsUrl = 'https://mission.swanchain.io/';

  const response = await axios.get(`${process.env.ADS_API_URL}/browser/start`, {
    params: { user_id: userId },
  });

  if (response.data.code === 0 && response.data.data.ws && response.data.data.ws.puppeteer) {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: response.data.data.ws.puppeteer,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      await page.goto(questsUrl, { waitUntil: 'load' });

      await wait(1012, 5012);
      await scenarioThree(browser, page, dailyCombo, onlyDaily);
      // switch (getRandomArrayElement([1, 2, 3])) {
      //   case 1:
      //     await scenarioOne(browser, page, dailyCombo, onlyDaily)
      //     break
      //
      //   case 2:
      //     await scenarioTwo(browser, page, dailyCombo, onlyDaily)
      //     break
      //
      //   case 3:
      //     await scenarioThree(browser, page, dailyCombo, onlyDaily)
      // }
    } catch (err) {
      logToFile(`Failed profile with id: ${userId}. Error: ${err}`);
      console.log(`Failed profile with id: ${userId}`, err);
    }
  }

  logToFile(`--------- Exit profile id ${userId} ---------`);
  console.log(`--------- Exit profile id ${userId} ---------`);
}

async function scenarioOne(browser, page, dailyCombo, onlyDaily) {
  await scrollPage(page, {
    tag: '.el-main',
    selector: '.total-referral',
  });

  await wait(1214, 3521);
  await completeDailyQuest(page, dailyCombo);
  await wait(1214, 3521);

  if (!onlyDaily) {
    await scrollPage(page, {
      tag: '.el-main',
      selector: '.task-all',
    });

    await completeCommonQuests(browser, page);
    await wait(1214, 3521);
  }

  await page.close();
  await browser.close();
}

async function scenarioTwo(browser, page, dailyCombo, onlyDaily) {
  if (!onlyDaily) {
    await scrollPage(page, {
      tag: '.el-main',
      selector: '.task-all',
    });

    await completeCommonQuests(browser, page);
    await wait(1214, 3521);
  }

  await scrollPage(page, {
    tag: '.el-main',
    selector: '.reward-card',
    direction: !onlyDaily ? 'up' : 'down',
    minDistance: 102,
    maxDistance: 423,
  });

  await wait(1214, 3521);
  await completeDailyQuest(page, dailyCombo);
  await wait(1214, 3521);

  await page.close();
  await browser.close();
}

async function scenarioThree(browser, page, dailyCombo, onlyDaily) {
  const Scroller = new PageScroller({ page, scrollableTag: '.el-main' });

  await Scroller.scrollToBottom();

  // await scrollPage(page, {
  //   tag: '.el-main',
  //   selector: '.faq',
  //   minDistance: 102,
  //   maxDistance: 523,
  // });
  //
  //
  // await wait(1214, 3521);
  //
  // await scrollPage(page, {
  //   tag: '.el-main',
  //   selector: '.reward-card',
  //   direction: 'up',
  //   minDistance: 102,
  //   maxDistance: 523,
  // });

  // await wait(1214, 3521)
  // await completeDailyQuest(page, dailyCombo)
  // await wait(1214, 3521)
  //
  // if (!onlyDaily) {
  //   await scrollPage(page, {
  //     tag: '.el-main',
  //     selector: '.task-all'
  //   })
  //
  //   await completeCommonQuests(browser, page)
  //   await wait(1214, 3521)
  // }
  //
  // await page.close()
  // await browser.close()
}

async function completeDailyQuest(page, dailyCombo) {
  if ((await page.$('.reward-card .reward-card-btn')) === null) {
    return;
  }

  await hoverAndClick(await page.locator('.reward-card .reward-card-btn'));
  await page.waitForSelector('.daliy-card .random-container');

  await wait(2027, 4126);
  await clickDailyNumber(page, dailyCombo.dailyFirst);
  await wait(1027, 3126);
  await clickDailyNumber(page, dailyCombo.dailySecond);
  await wait(1027, 3126);
  await clickDailyNumber(page, dailyCombo.dailyThird);
  await wait(1027, 3126);

  await hoverAndClick(await page.locator('.daliy-card .confirm-btn'));
  await wait(4027, 7126);
  await hoverAndClick(await page.locator('.daliy-card .close-btn'));
}

async function clickDailyNumber(page, number) {
  const element = await page.$(`.random-image${number}`);

  if (element) {
    await element.click();
  }
}

async function completeCommonQuests(browser, page) {
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
    if (taskTitle.toLowerCase()
      .includes('follow')) {
      taskType = TASK_TYPES.follow;
    } else if (taskTitle.toLowerCase()
      .includes('like')) {
      taskType = TASK_TYPES.like;
    } else if (taskTitle.toLowerCase()
      .includes('repost')) {
      taskType = TASK_TYPES.repost;
    } else if (taskTitle.toLowerCase()
      .includes('comment')) {
      taskType = TASK_TYPES.comment;
      continue;
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
      await processTwitter(twitterPage, taskType);
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

async function processTwitter(page, taskType) {
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

  await wait(1027, 3261);
}

module.exports = { run };
