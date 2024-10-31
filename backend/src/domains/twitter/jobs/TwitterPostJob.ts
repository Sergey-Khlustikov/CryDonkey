// @ts-nocheck
import AdsPowerService from "#src/domains/ads/services/AdsPowerService.js";
import {hoverAndClick, minimizeBrowser, wait} from '#src/domains/puppeteer/helpers/puppeteerHelpers.js';
import TwitterService from "#src/domains/twitter/services/TwitterService.js";
import typeWithRandomDelay from "#src/domains/puppeteer/helpers/typeWithRandomDelay.js";
import {TWITTER_POST_AUTOMATION_TYPES} from "#src/domains/twitter/structures/TwitterAutomationTypes.js";
import OpenAIApi from "#src/api/OpenAIApi.js";

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
      const browser = await AdsPowerService.connectToPuppeteer(this.profile.id);

      try {
        await this.start(browser);
      } finally {
        if (!this.keepOpenProfileIds.includes(this.profile.id)) {
          await browser.close();
        } else {
          await minimizeBrowser(browser)
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
