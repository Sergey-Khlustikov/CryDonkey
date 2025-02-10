import { wait } from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import { Frame, Page } from 'puppeteer';

const randomOptions = {
  minDistance: 77,
  maxDistance: 152,
  minDelay: 79,
  maxDelay: 1021,
};

interface ScrollOptions {
  minDistance?: number;
  maxDistance?: number;
  minDelay?: number;
  maxDelay?: number;
  direction?: 'up' | 'down';
  targetPosition?: number;
}

class PageScroller {
  private page: Page | Frame;
  private scrollableTag: any;

  constructor({
    page,
    scrollableTag,
  }: {
    page: Page | Frame;
    scrollableTag: string;
  }) {
    this.page = page;
    this.scrollableTag = scrollableTag;
  }

  private async scroll({
    minDistance,
    maxDistance,
    minDelay,
    maxDelay,
    direction,
    targetPosition,
  }: ScrollOptions) {
    let scrolled =
      direction === 'down'
        ? 0
        : await this.getScrollTopPosition(this.scrollableTag);

    const isScrolling = () => {
      return direction === 'down'
        ? scrolled < targetPosition!
        : scrolled > targetPosition!;
    };

    while (isScrolling()) {
      const distance = calculateRandomScrollDistance(
        minDistance!,
        maxDistance!,
      );
      const scrollDistance = direction === 'down' ? distance : -distance;

      await this.page.evaluate(
        ({ distance, tag }) => {
          document.querySelector(tag)?.scrollBy({
            top: distance,
            behavior: 'smooth',
          });
        },
        { distance: scrollDistance, tag: this.scrollableTag },
      );

      scrolled += scrollDistance;

      if (!isScrolling()) {
        break;
      }

      await wait(minDelay!, maxDelay!);
    }
  }

  async scrollToBottom({
    minDistance = randomOptions.minDistance,
    maxDistance = randomOptions.maxDistance,
    minDelay = randomOptions.minDelay,
    maxDelay = randomOptions.maxDelay,
  }: ScrollOptions = {}) {
    const targetPosition = await this.getScrollHeight(this.scrollableTag);
    await this.scroll({
      minDistance,
      maxDistance,
      minDelay,
      maxDelay,
      direction: 'down',
      targetPosition,
    });
  }

  async scrollToTop({
    minDistance = randomOptions.minDistance,
    maxDistance = randomOptions.maxDistance,
    minDelay = randomOptions.minDelay,
    maxDelay = randomOptions.maxDelay,
  }: ScrollOptions = {}) {
    const targetPosition = 0;
    await this.scroll({
      minDistance,
      maxDistance,
      minDelay,
      maxDelay,
      direction: 'up',
      targetPosition,
    });
  }

  async scrollToElement(
    element: any,
    {
      minDistance = randomOptions.minDistance,
      maxDistance = randomOptions.maxDistance,
      minDelay = randomOptions.minDelay,
      maxDelay = randomOptions.maxDelay,
    }: ScrollOptions = {},
  ) {
    const targetPosition = await this.page.evaluate(
      (el, tag) => {
        const element = document.querySelector(el);
        const container = document.querySelector(tag);
        return element
          ? element.getBoundingClientRect().top + container.scrollTop
          : null;
      },
      element,
      this.scrollableTag,
    );

    if (targetPosition === null) {
      throw new Error(`PageScroller: Element "${element}" not found.`);
    }

    const currentPosition = await this.getScrollTopPosition(this.scrollableTag);
    const direction = currentPosition < targetPosition ? 'down' : 'up';

    await this.scroll({
      minDistance,
      maxDistance,
      minDelay,
      maxDelay,
      direction,
      targetPosition,
    });
  }

  async scrollToElementCenter(
    element: any,
    {
      minDistance = randomOptions.minDistance,
      maxDistance = randomOptions.maxDistance,
      minDelay = randomOptions.minDelay,
      maxDelay = randomOptions.maxDelay,
    }: ScrollOptions = {},
  ) {
    const targetPosition = await this.page.evaluate(
      (el, tag) => {
        const element = document.querySelector(el);
        const container = document.querySelector(tag);
        const containerScrollTop = container.scrollTop;
        const elementPosition =
          element.getBoundingClientRect().top + containerScrollTop;
        const containerHeight = container.clientHeight;

        return elementPosition - containerHeight / 2;
      },
      element,
      this.scrollableTag,
    );

    if (targetPosition === null) {
      throw new Error(`PageScroller: Element "${element}" not found.`);
    }

    const currentPosition = await this.getScrollTopPosition(this.scrollableTag);
    const direction = currentPosition < targetPosition ? 'down' : 'up';

    await this.scroll({
      minDistance,
      maxDistance,
      minDelay,
      maxDelay,
      direction,
      targetPosition,
    });
  }

  private async getScrollTopPosition(tag: any): Promise<number> {
    return this.page.evaluate(
      (tag) => document.querySelector(tag)?.scrollTop || 0,
      tag,
    );
  }

  private async getScrollHeight(tag: any): Promise<number> {
    return this.page.evaluate(
      (tag) => document.querySelector(tag)?.scrollHeight || 0,
      tag,
    );
  }
}

function calculateRandomScrollDistance(
  minDistance: number,
  maxDistance: number,
): number {
  return Math.random() * (maxDistance - minDistance) + minDistance;
}

export default PageScroller;
