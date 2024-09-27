import PageScroller from '../../../../../automatization/helpers/PageScroller.mjs';
import {hoverAndClick, wait} from '../../../../../automatization/helpers/puppeteerHelpers.mjs';

class BlumPlayClickerGameHandler {
  async run(blumFrame, tgPage) {
    try {
      await blumFrame.waitForSelector('.index-page');
      const scroller = new PageScroller({page: blumFrame, scrollableTag: '.theme-default'});
      await scroller.scrollToBottom();

      await blumFrame.click('a.play-btn');

      await this.playGame(blumFrame, tgPage);
    } catch (e) {
      throw e;
    }
  }

  async playGame(frame, tgPage) {
    try {
      const canvasElement = await frame.waitForSelector('.pages-game-process canvas');

      let i = 0;

      while (true) {
        i++;

        const greenPixels = await this.findPixelsByColor(frame, 129, 255, 41);

        if (!greenPixels) {
          await this.processGameEnd(frame, tgPage);
          break;
        }

        if (greenPixels.length > 0) {
          await this.clickOnPixels(greenPixels, canvasElement, tgPage);
        }

        const bluePixels = await this.findPixelsByColor(frame, 96, 207, 222);

        if (bluePixels && bluePixels.length > 0) {
          const boundingBox = await canvasElement.boundingBox();
          const lowerBluePixels = bluePixels.filter(pixel => pixel.y > boundingBox.height / 2);

          if (lowerBluePixels.length > 0) {
            await this.clickOnPixels(lowerBluePixels, canvasElement, tgPage);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async findPixelsByColor(frame, r, g, b) {
    try {
      return frame.evaluate((r, g, b) => {
        const canvas = document.querySelector('.pages-game-process canvas');

        if (!canvas) {
          return null;
        }

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const foundPixels = [];

        for (let i = 0; i < pixels.length; i += 4) {
          const rChannel = pixels[i];
          const gChannel = pixels[i + 1];
          const bChannel = pixels[i + 2];

          if (rChannel === r && gChannel === g && bChannel === b) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            foundPixels.push({x, y});
          }
        }

        return foundPixels;
      }, r, g, b);
    } catch (e) {
      throw e;
    }
  }

  async clickOnPixels(pixels, canvasElement, tgPage) {
    const uniquePositions = await this.filterPixelsByCloseness(pixels);
    const boundingBox = await canvasElement.boundingBox();

    if (uniquePositions.length > 0) {
      for (let i = 0; i < 2; i++) {
        if (!uniquePositions[i]) {
          continue;
        }

        const {x, y} = uniquePositions[i];
        const absoluteX = boundingBox.x + x;
        const absoluteY = boundingBox.y + y;

        await tgPage.mouse.click(absoluteX, absoluteY);
        await wait(5, 10);
      }
    }
  }

  async filterPixelsByCloseness(pixels) {
    const uniquePixels = [];

    pixels.forEach((pos) => {
      const {x, y} = pos;
      const isNearby = uniquePixels.some((p) => Math.abs(p.x - x) < 50 && Math.abs(p.y - y) < 50);

      if (!isNearby) {
        uniquePixels.push({x, y});
      }
    });

    return uniquePixels;
  }

  async processGameEnd(blumFrame, tgPage) {
    try {
      await wait(2012, 4021);

      if (!blumFrame.$('.pages-game-end')) {
        throw new Error('Game failed');
      }

      if (await tgPage.$('.ChatOrUserPicker_slide')) {
        await tgPage.$('.ChatOrUserPicker_slide .modal-header button[aria-label="Close"]').click();
        await wait(1245, 3512);
      }

      const button = await blumFrame.$('.buttons button:last-of-type');

      if (!button) {
        throw new Error('Play button not found');
      }

      const buttonText = await button.evaluate(el => el.textContent.toLowerCase());

      if (buttonText.includes('continue')) {
        await hoverAndClick(button);
        return;
      }

      if (buttonText.includes('play')) {
        await hoverAndClick(button);
        await this.playGame(blumFrame, tgPage);
      }
    } catch (e) {
      throw e;
    }
  }
}

export default BlumPlayClickerGameHandler;
