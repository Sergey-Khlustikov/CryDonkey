import { Page } from 'puppeteer';

export const PUPPETEER_ON_PAGE_BLUR_FN = 'onPageBlur';

/**
 * Attaches listeners to a Puppeteer page that automatically bring it to the front
 * whenever the page loses focus or its visibility changes to hidden.
 *
 * @param page - The Puppeteer Page instance to monitor and refocus.
 */
export async function attachRefocusListener(page: Page): Promise<void> {
  await page.exposeFunction(PUPPETEER_ON_PAGE_BLUR_FN, async () => {
    try {
      await page.bringToFront();
    } catch {}
  });

  await page.evaluateOnNewDocument((fnName: string) => {
    const notify = () => (window as any)[fnName]();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') notify();
    });
    window.addEventListener('blur', notify);
  }, PUPPETEER_ON_PAGE_BLUR_FN);
}
