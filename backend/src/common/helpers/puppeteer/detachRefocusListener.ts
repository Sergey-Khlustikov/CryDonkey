import { Page } from 'puppeteer';
import { PUPPETEER_ON_PAGE_BLUR_FN } from '@src/common/helpers/puppeteer/attachRefocusListener.js';

/**
 * Detaches the refocus listener by overriding the exposed blur callback in the page context,
 * preventing further automatic refocus actions.
 *
 * @param page - The Puppeteer Page instance to stop monitoring.
 */
export async function detachRefocusListener(page: Page): Promise<void> {
  await page.evaluate((fnName: string) => {
    (window as any)[fnName] = () => {};
  }, PUPPETEER_ON_PAGE_BLUR_FN);
}
