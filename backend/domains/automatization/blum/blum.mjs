import AdsApi from '../../../api/AdsApi.mjs';
import { hoverAndClick, wait } from '../../../automatization/helpers/puppeteerHelpers.mjs';
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

  await playGame(blumFrame, tgPage);
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

async function playGame(frame, tgPage) {
  await frame.waitForSelector('.index-page');
  await frame.click('a.play-btn');

  const canvasElement = await frame.waitForSelector('canvas');

  setInterval(async () => {
    const greenElements = await frame.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const greenElements = [];

      // Устанавливаем диапазоны цветов
      const targetColorRanges = [
        { r: [63, 63], g: [219, 219], b: [0, 0] }, // rgb(63, 219, 0) с разбросом
        { r: [129, 129], g: [255, 255], b: [41, 41] }, // rgb(129, 255, 41) с разбросом
        { r: [176, 176], g: [243, 243243], b: [14, 14] },  // rgb(176, 243, 14) с разбросом
      ];

      const excludedColorRanges = [
        { r: [190, 200], g: [190, 200], b: [190, 200] }, // rgb(63, 219, 0) с разбросом
        { r: [130, 140], g: [130, 140], b: [130, 140] }, // rgb(129, 255, 41) с разбросом
        { r: [245, 255], g: [240, 250], b: [145, 155] },  // rgb(176, 243, 14) с разбросом
        { r: [90, 100], g: [90, 100], b: [90, 100] },  // rgb(176, 243, 14) с разбросом
        { r: [5, 15], g: [35, 45], b: [10, 20] },  // rgb(176, 243, 14) с разбросом
        { r: [15, 20], g: [70, 80], b: [27, 37] },  // rgb(176, 243, 14) с разбросом
      ];

      // Проверка пикселя на соответствие любому из диапазонов
      const isInRange = (r, g, b) => {
        const isTarget = targetColorRanges.some(range =>
          r >= range.r[0] && r <= range.r[1] &&
          g >= range.g[0] && g <= range.g[1] &&
          b >= range.b[0] && b <= range.b[1],
        );

        // const excluded = excludedColorRanges.some(range =>
        //   r >= range.r[0] && r <= range.r[1] &&
        //   g >= range.g[0] && g <= range.g[1] &&
        //   b >= range.b[0] && b <= range.b[1],
        // );

        return isTarget;
      };

      // Пробегаемся по каждому пикселю и проверяем цвет
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];      // Красный канал
        const g = pixels[i + 1];  // Зеленый канал
        const b = pixels[i + 2];  // Синий канал

        if (isInRange(r, g, b)) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          greenElements.push({ x, y });
        }
      }

      return greenElements;
    });

    const uniquePositions = [];
    greenElements.forEach(pos => {
      const { x, y } = pos;
      const isNearby = uniquePositions.some(p => Math.abs(p.x - x) < 20 && Math.abs(p.y - y) < 20);
      if (!isNearby) {
        uniquePositions.push({ x, y });
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

    // Запускаем клики с задержкой 500 миллисекунд
    await clickWithDelay(uniquePositions, 100);

  }, 100); // Периодичность анализа каждые 100 миллисекунд
}
