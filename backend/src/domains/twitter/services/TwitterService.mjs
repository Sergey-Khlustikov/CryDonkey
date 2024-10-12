class TwitterService {
  async isAuthenticated(browser) {
    try {
      const page = await browser.newPage();
      await page.goto('https://x.com/home', {waitUntil: 'networkidle2'});

      const cookies = await page.cookies();
      const authToken = cookies.find(cookie => cookie.name === 'auth_token');

      await page.close();

      return !!authToken;
    } catch (e) {
      throw e;
    }
  }
}

export default new TwitterService();
