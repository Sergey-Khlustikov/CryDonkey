import AdsApi from '../../../api/AdsApi.mjs';
import {hoverAndClick, wait} from '../../../automatization/helpers/puppeteerHelpers.mjs';
import PageScroller from '../../../automatization/helpers/PageScroller.mjs';

export async function run() {
  try {
    const browser = await AdsApi.connectToPuppeteer('kkg5f1b');

    await startQuests(browser);
  } catch (e) {
    throw e;
  }
}

async function startQuests(browser) {
  const tgPage = await openBlumBot(browser);
  await wait(4000, 7000);
  const blumFrame = await getBlumBotFrame(tgPage);

  const scroller = new PageScroller({ page: blumFrame, scrollableTag: '.theme-default' });
  await scroller.scrollToBottom();
  await wait(2150, 4057);

  await runClickerGame(blumFrame, tgPage);
}

async function openBlumBot(browser) {
  const page = await browser.newPage();

  // Переход на нужную страницу
  await page.goto('https://web.telegram.org/a/#6865543862');
  await wait(2000, 4000);
  const btn = await page.$('button.open::-p-text(Launch Blum)');

  if (btn) {
    await hoverAndClick(btn);
    return page;
  } else {
    throw new Error('button not found');
  }
}

async function getBlumBotFrame(tgPage) {
  const modalIframe = await tgPage.waitForSelector('.Modal iframe');

  if (!modalIframe) {
    throw new Error('Modal iframe not found.');
  }

  const iframeContent = await modalIframe.contentFrame();

  if (!iframeContent) {
    throw new Error('Unable to access content inside iframe');
  }

  return iframeContent;
}

async function runClickerGame(blumFrame, tgPage) {
  await blumFrame.waitForSelector('.index-page');
  await blumFrame.click('a.play-btn');

  try {
    await playGame(blumFrame, tgPage);
  } catch (e) {
    console.log('isDetached', blumFrame.detached);
    console.log('error', e);
  }
}

async function playGame(frame, tgPage) {
  const canvasElement = await frame.waitForSelector('canvas');

  setInterval(async () => {
    const greenElements = await frame.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const greenElements = [];

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        if (r === 129 && g === 255 && b === 41) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          greenElements.push({ x, y });
        }
      }

      return greenElements;
    });

    if (greenElements.length > 0) {
      const uniquePositions = [];

      greenElements.forEach(pos => {
        const {x, y} = pos;
        const isNearby = uniquePositions.some(p => Math.abs(p.x - x) < 50 && Math.abs(p.y - y) < 50);

        if (!isNearby) {
          uniquePositions.push({x, y});
        }
      });

      // Получаем bounding box canvas для вычисления реальных координат кликов
      const boundingBox = await canvasElement.boundingBox();

      // Функция для клика с задержкой
      const clickWithDelay = async (positions, delay) => {
        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i];
          const absoluteX = boundingBox.x + pos.x;
          const absoluteY = boundingBox.y + pos.y;

          await tgPage.mouse.click(absoluteX, absoluteY);

          // Ждем перед следующим кликом
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      };

      // Запускаем клики с задержкой 100 миллисекунд
      await clickWithDelay(uniquePositions, 100);
    }
  }, 50); // Периодичность анализа каждые 100 миллисекунд
}
