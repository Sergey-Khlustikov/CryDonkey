import {
  hoverAndClick,
  wait,
} from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import { ElementHandle, Frame, Page } from 'puppeteer';
import getButtonByText from '@src/common/helpers/puppeteer/getButtonByText.js';

interface IPixel {
  x: number;
  y: number;
}

class BlumPlayClickerGameHandler {
  async run(blumFrame: Frame, tgPage: Page) {
    try {
      const playBtn = await getButtonByText(blumFrame, 'play', {
        searchContainerSelector: '.pages-index-game',
        strict: false,
      });

      if (!playBtn) {
        throw new Error('Play button not found.');
      }

      await hoverAndClick(playBtn);

      await this.playGame(blumFrame, tgPage);
    } catch (e) {
      throw e;
    }
  }

  async playGame(frame: Frame, tgPage: Page) {
    try {
      const canvasElement = await frame.waitForSelector(
        '.pages-game-process canvas',
      );

      while (true) {
        const greenPixels = await this.findPixelsByColor(frame, 129, 255, 41);

        if (!greenPixels) {
          await this.processGameEnd(frame, tgPage);
          break;
        }

        if (canvasElement && greenPixels.length > 0) {
          await this.clickOnPixels(greenPixels, canvasElement, tgPage);
        }

        const bluePixels = await this.findPixelsByColor(frame, 96, 207, 222);

        if (canvasElement && bluePixels && bluePixels.length > 0) {
          const boundingBox = await canvasElement.boundingBox();

          if (boundingBox) {
            const lowerBluePixels = bluePixels.filter(
              (pixel) => pixel.y > boundingBox.height / 2,
            );

            if (lowerBluePixels.length > 0) {
              await this.clickOnPixels(lowerBluePixels, canvasElement, tgPage);
            }
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async findPixelsByColor(frame: Frame, r: number, g: number, b: number) {
    try {
      return frame.evaluate(
        (r, g, b) => {
          const canvas = document.querySelector(
            '.pages-game-process canvas',
          ) as HTMLCanvasElement;

          if (!canvas) {
            return null;
          }

          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return null;
          }

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          const foundPixels: IPixel[] = [];

          for (let i = 0; i < pixels.length; i += 4) {
            const rChannel = pixels[i];
            const gChannel = pixels[i + 1];
            const bChannel = pixels[i + 2];

            if (rChannel === r && gChannel === g && bChannel === b) {
              const x = (i / 4) % canvas.width;
              const y = Math.floor(i / 4 / canvas.width);
              foundPixels.push({ x, y });
            }
          }

          return foundPixels;
        },
        r,
        g,
        b,
      );
    } catch (e) {
      throw e;
    }
  }

  async clickOnPixels(
    pixels: IPixel[],
    canvasElement: ElementHandle<HTMLCanvasElement>,
    tgPage: Page,
  ) {
    const uniquePositions = await this.filterPixelsByCloseness(pixels);
    const boundingBox = await canvasElement.boundingBox();

    if (!boundingBox) {
      return;
    }

    if (uniquePositions.length > 0) {
      for (let i = 0; i < 2; i++) {
        if (!uniquePositions[i]) {
          continue;
        }

        const { x, y } = uniquePositions[i];
        const absoluteX = boundingBox.x + x;
        const absoluteY = boundingBox.y + y;

        await tgPage.mouse.click(absoluteX, absoluteY);
        await wait(5, 10);
      }
    }
  }

  async filterPixelsByCloseness(pixels: IPixel[]) {
    const uniquePixels: { x: number; y: number }[] = [];

    pixels.forEach((pos) => {
      const { x, y } = pos;
      const isNearby = uniquePixels.some(
        (p) => Math.abs(p.x - x) < 50 && Math.abs(p.y - y) < 50,
      );

      if (!isNearby) {
        uniquePixels.push({ x, y });
      }
    });

    return uniquePixels;
  }

  async processGameEnd(blumFrame: Frame, tgPage: Page) {
    await wait(2012, 4021);

    if (await tgPage.$('.ChatOrUserPicker_slide')) {
      const modalBtn = await tgPage.$(
        '.ChatOrUserPicker_slide .modal-header button[aria-label="Close"]',
      );

      if (modalBtn) {
        await modalBtn.click();
        await wait(1245, 3512);
      }
    }

    let button = await this.findButtonByText(blumFrame, 'play');

    if (button) {
      await hoverAndClick(button);
      await this.playGame(blumFrame, tgPage);
      return;
    }

    if (!button) {
      button = await this.findButtonByText(blumFrame, 'continue');
    }

    if (!button) {
      button = await this.findButtonByText(blumFrame, 'return');
    }

    if (!button) {
      throw new Error('No valid button found (play, continue, return)');
    }

    await hoverAndClick(button);
  }

  async findButtonByText(frame: Frame, text: string) {
    const buttons = await frame.$$('.buttons button');

    for (const button of buttons) {
      const buttonText = await button.evaluate(
        (el) => el.textContent?.toLowerCase() || '',
      );

      if (buttonText.includes(text.toLowerCase())) {
        return button;
      }
    }

    return null;
  }
}

export default BlumPlayClickerGameHandler;
