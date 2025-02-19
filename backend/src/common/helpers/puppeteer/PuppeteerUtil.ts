import { ElementHandle } from 'puppeteer';

export class PuppeteerUtil {
  static async elementHasClass(
    element: ElementHandle,
    className: string,
  ): Promise<boolean> {
    return await element.evaluate(
      (el, clsName) => el.classList.contains(clsName),
      className,
    );
  }
}
