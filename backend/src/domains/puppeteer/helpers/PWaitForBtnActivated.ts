import {ElementHandle, Page} from "puppeteer";

async function PWaitForBtnActivated(page: Page, btn: ElementHandle, timeout: number = 10000): Promise<void> {
  await page.waitForFunction(
    (btn) => !btn.hasAttribute('disabled'),
    {timeout},
    btn
  );
}

export default PWaitForBtnActivated;
