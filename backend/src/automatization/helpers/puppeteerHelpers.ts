import {ElementHandle} from "puppeteer";

export function wait(minMs: number, maxMs: number) {
  const waitTime = Math.random() * (maxMs - minMs) + minMs;

  return new Promise(resolve => { setTimeout(resolve, waitTime); });
}

export async function hoverAndClick(locator: ElementHandle) {
  await locator.hover();
  await wait(405, 1421);
  await locator.click();
}
