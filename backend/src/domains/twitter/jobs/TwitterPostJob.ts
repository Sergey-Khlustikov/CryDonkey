import AdsRepository from '../../ads/services/AdsPowerService';
import {hoverAndClick, wait} from '../../../automatization/helpers/puppeteerHelpers';
import TwitterService from '../services/TwitterService';
import typeWithRandomDelay from '../../../automatization/helpers/typeWithRandomDelay';
import {TWITTER_POST_AUTOMATION_TYPES} from '../structures/TwitterAutomationTypes';
import OpenAIApi from '../../../api/OpenAIApi';

class TwitterPostJob {
  constructor(job, {profile, keepOpenProfileIds, automationType, post}) {
    this.job = job;
    this.profile = profile;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.automationType = automationType;
    this.post = post;
  }

  async run() {
    try {
      const browser = await AdsRepository.connectToPuppeteer(this.profile.id);

      try {
        await this.start(browser);
      } finally {
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async start(browser) {
    const page = await browser.newPage();

    try {
      if (!(await TwitterService.isAuthenticated(browser))) {
        throw new Error('Twitter is not authenticated');
      }

      await page.goto('https://x.com/home', {waitUntil: 'networkidle2'});

      await wait(1012, 5012);
      await this.writePost(page);
    } catch (e) {
      throw e;
    } finally {
      await page.close();
    }
  }

  async writePost(page) {
    try {
      const openPostModalBtn = await page.locator('a[data-testid="SideNav_NewTweet_Button"]');
      await hoverAndClick(openPostModalBtn);

      await wait(3012, 9125);

      const textAreaSelector = '.DraftEditor-editorContainer .public-DraftStyleDefault-ltr > span';
      await page.waitForSelector(textAreaSelector);

      await typeWithRandomDelay(page, textAreaSelector, await this.getPostContent());
      await wait(2312, 5112);

      const postBtn = await page.locator('button[data-testid="tweetButton"]');
      await hoverAndClick(postBtn);
      await wait(3012, 9125);
    } catch (e) {
      throw e;
    }
  }

  async getPostContent() {
    if (this.automationType === TWITTER_POST_AUTOMATION_TYPES.manual) {
      return this.post.post;
    }

    return this.getAIGeneratedPost();
  }

  async getAIGeneratedPost() {
    const prompt = 'Generate short creative human-like twitter post on a random topic. 1-2 sentences, no emojis';
    return OpenAIApi.generateMessage(prompt);
  }
}

export default TwitterPostJob;
