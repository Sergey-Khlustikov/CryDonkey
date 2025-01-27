import { Page } from 'puppeteer';

async function checkTwitterAuth(page: Page) {
  const cookies = await page.cookies();
  const authToken = cookies.find((cookie) => cookie.name === 'auth_token');

  return !!authToken;
}

export default checkTwitterAuth;
