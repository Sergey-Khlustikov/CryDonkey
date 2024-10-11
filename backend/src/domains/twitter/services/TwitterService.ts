import TwitterAccount from '../models/TwitterAccount';

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

  async add(TwitterAccountDTO) {

  }

  async linkTwitterToProfile(twitterId, profileSource, profileId) {
    const twitterAccount = await TwitterAccount.findById(twitterId);

    if (!twitterAccount) {
      throw new Error('Twitter account not found');
    }

    twitterAccount.linkedProfile = {source: profileSource, profileId};
    await twitterAccount.save();
  }

  async unlinkTwitterToProfile(twitterId, profileSource, profileId) {
    const twitterAccount = await TwitterAccount.findById(twitterId);

    if (!twitterAccount) {
      throw new Error('Twitter account not found');
    }

    twitterAccount.linkedProfile = null;
    await twitterAccount.save();
  }
}

export default new TwitterService();
