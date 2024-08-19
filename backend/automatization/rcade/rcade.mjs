import axios from 'axios';
import puppeteer from 'puppeteer';
import getRandomArrayElement from 'backend/automatization/helpers/getRandomArrayElement.mjs';
import PageScroller from 'backend/automatization/helpers/PageScroller.mjs';
import { hoverAndClick, wait } from 'backend/automatization/helpers/puppeteerHelpers.mjs';

export async function run(profileIds) {
  try {
    for (let i = 0; i < profileIds.length; i++) {
      await openProfile(profileIds[i]);

      if (i !== profileIds.length - 1) {
        await wait(60000, 200000);
      }
    }
  } catch (e) {
    console.log('Error in run', e);
  }
}

async function openProfile(userId) {
  const questsUrl = 'https://sidequest.rcade.game/quests';

  const response = await axios.get(`${process.env.VUE_APP_ADS_API_URL}/browser/start`, {
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

      await page.locator('.missions')
        .wait();

      await wait(1012, 5012);

      switch (getRandomArrayElement([1, 2, 3])) {
        case 1:
          await scenarioOne(page, browser);
          break;

        case 2:
          await scenarioTwo(page, browser);
          break;

        case 3:
          await scenarioThree(page, browser);
          break;

        default:
          console.log('Unknown scenario');
      }
    } catch (err) {
      console.log(`Profile id: ${userId}`, err);
    }
  }
}

async function scenarioOne(page, browser) {
  const Scroller = new PageScroller({ page, scrollableTag: 'html' });

  await Scroller.scrollToElement('.mission-list');
  await wait(1593, 3021);
  await Scroller.scrollToTop({
    minDistance: 102,
    maxDistance: 423,
  });

  await completeDailyQuest(page);

  await wait(1242, 4512);

  await Scroller.scrollToElement('.mission-list');

  await wait(1242, 4512);

  await completeCommonQuests(page, browser);

  await page.close();
  await browser.close();
}

async function scenarioTwo(page, browser) {
  const Scroller = new PageScroller({ page, scrollableTag: 'html' });
  await completeDailyQuest(page);

  await wait(3242, 5512);

  await Scroller.scrollToElement('.mission-list');

  await wait(1242, 4512);

  await completeCommonQuests(page, browser);

  await page.close();
  await browser.close();
}

async function scenarioThree(page, browser) {
  const Scroller = new PageScroller({ page, scrollableTag: 'html' });
  await Scroller.scrollToElement('.mission-list');

  await wait(1242, 4512);

  await completeCommonQuests(page, browser);

  await wait(1242, 4512);
  await Scroller.scrollToTop({
    minDistance: 102,
    maxDistance: 423,
  });
  await wait(1242, 2512);

  await completeDailyQuest(page);

  await page.close();
  await browser.close();
}

async function completeDailyQuest(page) {
  if ((await page.$('.spin-container .spin-content button')) === null) {
    return;
  }

  const mainBtn = await page.locator('.spin-container .spin-content button');

  await hoverAndClick(mainBtn);

  // @todo failed to hover
  const modalSpinBtn = await page.locator('.modal-content button.spin-btn');
  await modalSpinBtn.wait();
  await wait(1051, 5012);
  await hoverAndClick(modalSpinBtn);

  await page.locator('.rewards .reward-points')
    .wait();
  await wait(1051, 5012);

  const closeBtn = await page.locator('.modal .modal-container .modal-content button.close-btn');
  await hoverAndClick(closeBtn);
}

async function completeCommonQuests(page, browser) {
  await page.waitForSelector('.mission-list');
  const pageTarget = page.target();

  const buttonHandles = await page.evaluateHandle(() => {
    const missionElements = document.querySelectorAll('.mission');

    return Array.from(missionElements)
      .filter(mission => {
        const isCompleted = mission.classList.contains('completed');
        const title = mission.querySelector('.title')
          .textContent
          .trim()
          .toLowerCase();

        return !isCompleted && !title.includes('wallet') && !title.includes('telegram');
      })
      .map(mission => mission.querySelector('button'));
  });

  const buttons = await buttonHandles.getProperties();

  if (buttons.length === 0) {
    return;
  }

  const buttonLocators = [];

  for (const buttonHandle of buttons.values()) {
    if (buttonHandle) {
      buttonLocators.push(buttonHandle.asElement());
    }
  }

  for (const buttonLocator of buttonLocators) {
    if (buttonLocator) {
      await buttonLocator.hover();
      await wait(212, 563);
      await buttonLocator.click();

      await page.waitForSelector('.mission-details .btn-container button');
      const redirectBtn = await page.locator('.mission-details .btn-container button');
      await hoverAndClick(redirectBtn);

      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      const newPage = await newTarget.page();

      if (newPage) {
        await wait(1421, 3012);
        await newPage.close();
      }

      await page.bringToFront();
      await page.waitForSelector('.rewards .congratulations');
      await wait(1224, 4012);
      await hoverAndClick(await page.locator('.modal .close-btn'));

      await wait(2016, 5921);
    }
  }
}
