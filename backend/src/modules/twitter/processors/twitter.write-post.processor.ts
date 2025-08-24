import { Processor } from '@nestjs/bullmq';
import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import { Browser, Page } from 'puppeteer';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { Job } from 'bullmq';
import { hoverAndClick, minimizeBrowser, wait } from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import typeWithRandomDelay from '@src/common/helpers/puppeteer/typeWithRandomDelay.js';
import { OpenAiService } from '@src/modules/open-ai/services/open-ai.service.js';
import { TwitterService } from '@src/modules/twitter/services/twitter.service.js';
import { EQueueNames, ETwitterAutomationTypes, IBaseJobProfile } from '@crydonkey/shared';

@Processor(EQueueNames.TwitterPost)
export class TwitterWritePostProcessor extends AutomationProjectProcessor {
  protected readonly queueName = EQueueNames.TwitterPost;

  protected profile: IBaseJobProfile;
  protected userId: string;
  protected page: Page;
  protected browser: Browser;
  protected post: string;
  protected automationType: ETwitterAutomationTypes;
  protected keepOpenProfile: boolean;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
    protected openAIService: OpenAiService,
    protected twitterService: TwitterService,
  ) {
    super(queuesManager);
  }

  async handleJob(job: Job): Promise<any> {
    const { profile, userId, keepOpenProfile, post, automationType } = job.data;

    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfile = keepOpenProfile;
    this.post = post;
    this.automationType = automationType;

    await this.run();
  }

  async run() {
    try {
      this.browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );

      try {
        await this.start();
      } finally {
        if (!this.keepOpenProfile) {
          await this.browser.close();
        } else {
          await minimizeBrowser(this.browser);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async start() {
    this.page = await this.browser.newPage();

    try {
      if (!(await this.twitterService.isAuthenticated(this.browser))) {
        throw new Error('Twitter is not authenticated');
      }

      await this.page.goto('https://x.com/home', { waitUntil: 'networkidle2' });

      await wait(1012, 5012);
      await this.writePost();
    } finally {
      await this.page.close();
    }
  }

  async writePost() {
    try {
      const openPostModalBtn = this.page.locator(
        'a[data-testid="SideNav_NewTweet_Button"]',
      );
      await hoverAndClick(openPostModalBtn);

      await wait(3012, 9125);

      const textAreaSelector =
        '.DraftEditor-editorContainer .public-DraftStyleDefault-ltr > span';
      await this.page.waitForSelector(textAreaSelector);

      await typeWithRandomDelay(
        this.page,
        textAreaSelector,
        await this.getPostContent(),
      );
      await wait(2312, 5112);

      const postBtn = this.page.locator('button[data-testid="tweetButton"]');
      await hoverAndClick(postBtn);
      await wait(3012, 9125);
    } catch (e) {
      throw e;
    }
  }

  async getPostContent() {
    if (this.automationType === ETwitterAutomationTypes.manual) {
      return this.post;
    }

    return this.getAIGeneratedPost();
  }

  async getAIGeneratedPost() {
    const prompt =
      'Generate short creative human-like twitter post on a random topic. 1-2 sentences, no emojis';
    return this.openAIService.generateMessage({ prompt: prompt });
  }
}
