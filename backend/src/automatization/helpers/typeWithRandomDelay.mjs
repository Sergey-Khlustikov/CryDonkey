async function typeWithRandomDelay(page, selector, text, minDelay = 50, maxDelay = 500) {
  for (const char of text) {
    await page.type(selector, char);
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
  }
}

export default typeWithRandomDelay;
