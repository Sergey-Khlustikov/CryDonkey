async function triggerBrowserExtension(browser, page, id) {
  const extBackgroundTarget = await browser.waitForTarget(
    target => target.type() === 'service_worker' && target.url().includes(id),
  );

  const extWorker = await extBackgroundTarget.worker();

  await page.bringToFront();

  await extWorker.evaluate(() => {
    chrome.action.openPopup();
  });
}

export default triggerBrowserExtension;
