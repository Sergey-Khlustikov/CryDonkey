const { wait } = require('backend/automatization/helpers/puppeteerHelpers');

const randomOptions = {
  minDistance: 77,
  maxDistance: 159,
  minDelay: 79,
  maxDelay: 1021,
};

class PageScroller {
  constructor({ page, scrollableTag }) {
    this.page = page;
    this.scrollableTag = scrollableTag;
  }

  async scroll({ minDistance, maxDistance, minDelay, maxDelay, direction, targetPosition }) {
    let scrolled = direction === 'down' ? 0 : await this.getScrollTopPosition(this.scrollableTag);

    const isScrolling = () => (direction === 'down' ? scrolled < targetPosition : scrolled > targetPosition);

    while (isScrolling()) {
      const distance = calculateRandomScrollDistance(minDistance, maxDistance);
      const scrollDistance = direction === 'down' ? distance : -distance;

      await this.page.evaluate(({ distance, tag }) => {
        document.querySelector(tag)
          .scrollBy({
            top: distance,
            behavior: 'smooth',
          });
      }, { distance: scrollDistance, tag: this.scrollableTag });

      scrolled += scrollDistance;

      if (!isScrolling()) {
        break;
      }

      await wait(minDelay, maxDelay);
    }
  }

  // Метод для прокрутки вниз
  async scrollToBottom({
    minDistance = randomOptions.minDistance,
    maxDistance = randomOptions.maxDistance,
    minDelay = randomOptions.minDelay,
    maxDelay = randomOptions.maxDelay,
  } = {}) {
    const targetPosition = await this.getScrollHeight(this.scrollableTag);
    await this.scroll({
      minDistance, maxDistance, minDelay, maxDelay, direction: 'down', targetPosition,
    });
  }

  // Метод для прокрутки вверх
  async scrollToTop({
    minDistance = randomOptions.minDistance,
    maxDistance = randomOptions.maxDistance,
    minDelay = randomOptions.minDelay,
    maxDelay = randomOptions.maxDelay,
  } = {}) {
    const targetPosition = 0;
    await this.scroll({
      minDistance, maxDistance, minDelay, maxDelay, direction: 'up', targetPosition,
    });
  }

  async scrollToElement(element, {
    minDistance = randomOptions.minDelay,
    maxDistance = randomOptions.maxDistance,
    minDelay = randomOptions.minDelay,
    maxDelay = randomOptions.maxDelay,
  } = {}) {
    const targetPosition = await this.page.evaluate((el, tag) => {
      const element = document.querySelector(el);
      const container = document.querySelector(tag);
      return element ? element.getBoundingClientRect().top + container.scrollTop : 0;
    }, element, this.scrollableTag);

    const currentPosition = await this.getScrollTopPosition(this.scrollableTag);
    const direction = currentPosition < targetPosition ? 'down' : 'up';

    await this.scroll({ minDistance, maxDistance, minDelay, maxDelay, direction, targetPosition });
  }

  async getScrollTopPosition(tag) {
    return this.page.evaluate(tag => document.querySelector(tag).scrollTop, tag);
  }

  async getScrollHeight(tag) {
    return this.page.evaluate(tag => document.querySelector(tag).scrollHeight, tag);
  }
}

function calculateRandomScrollDistance(minDistance, maxDistance) {
  return Math.random() * (maxDistance - minDistance) + minDistance;
}

module.exports = PageScroller;
