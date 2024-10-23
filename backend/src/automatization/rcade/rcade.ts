// @ts-nocheck
import getRandomArrayElement from "#src/automatization/helpers/getRandomArrayElement.js";
import PageScroller from "#src/automatization/helpers/PageScroller.js";
import {hoverAndClick, wait} from "#src/automatization/helpers/puppeteerHelpers.js";
import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";

export async function run(data) {
  try {
    const browser = await AdsPowerService.connectToPuppeteer(data.profile.id);

    try {
      await startQuests({ browser });
    } finally {
      if (!data.keepOpenProfileIds.includes(data.profile.id)) {
        await browser.close();
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function startQuests({ browser }) {
  const questsUrl = 'https://sidequest.rcade.game/quests';
  const page = await browser.newPage();
  await page.goto(questsUrl, { waitUntil: 'load' });
  await page.locator('.missions').wait();

  await wait(1012, 5012);

  const scenario = getRandomArrayElement([1, 2, 3]);
  await runScenario(scenario, page, browser);
}

async function runScenario(scenario, page, browser) {
  const scroller = new PageScroller({ page, scrollableTag: 'html' });

  try {
    switch (scenario) {
      case 1:
        await scroller.scrollToElement('.mission-list');
        await wait(1593, 3021);
        await scroller.scrollToTop({ minDistance: 102, maxDistance: 423 });
        await completeDailyQuest(page);
        await wait(1242, 4512);
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await completeCommonQuests(page, browser);
        break;

      case 2:
        await completeDailyQuest(page);
        await wait(3242, 5512);
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await completeCommonQuests(page, browser);
        break;

      case 3:
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await completeCommonQuests(page, browser);
        await wait(1242, 2512);
        await scroller.scrollToTop({ minDistance: 102, maxDistance: 423 });
        await wait(1242, 2512);
        await completeDailyQuest(page);
        break;

      default:
        throw new Error('Unknown scenario');
    }
  } catch (error) {
    throw error;
  } finally {
    await page.close();
  }
}

async function completeDailyQuest(page) {
  try {
    const button = await page.$('.spin-container .spin-content button');

    if (!button) {
      return;
    }

    await hoverAndClick(button);

    const modalSpinBtn = await page.locator('.modal-content button.spin-btn');
    await modalSpinBtn.wait();
    await wait(1051, 5012);
    await hoverAndClick(modalSpinBtn);

    await page.locator('.rewards .reward-points').wait();
    await wait(1051, 5012);

    const closeBtn = await page.locator('.modal .modal-container .modal-content button.close-btn');
    await hoverAndClick(closeBtn);
  } catch (error) {
    throw error;
  }
}

async function completeCommonQuests(page, browser) {
  try {
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

          return !isCompleted && !title.includes('wallet') && !title.includes('login with telegram');
        })
        .map(mission => mission.querySelector('button'));
    });

    const buttons = await buttonHandles.getProperties();

    if (buttons.length === 0) {
      return;
    }

    for (const buttonHandle of buttons.values()) {
      if (buttonHandle) {
        const buttonLocator = buttonHandle.asElement();
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
  } catch (error) {
    throw error;
  }
}
