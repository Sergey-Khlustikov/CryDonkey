import { AutomationProjectProcessor } from '@src/common/queues/automation-project.processor.js';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { Processor } from '@nestjs/bullmq';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { Job } from 'bullmq';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';
import { Browser, ElementHandle, Page } from 'puppeteer';
import {
  hoverAndClick,
  minimizeBrowser,
  wait,
} from '@src/common/helpers/puppeteer/puppeteerHelpers.js';
import getRandomArrayElement from '@src/common/helpers/getRandomArrayElement.js';
import PageScroller from '@src/common/helpers/puppeteer/PageScroller.js';

@Processor(EQueueNames.Rcade)
export class RcadeQueueProcessor extends AutomationProjectProcessor {
  protected readonly queueName = EQueueNames.Rcade;

  protected profile: IBaseJobProfile;
  protected userId: string;
  protected keepOpenProfile: boolean;
  protected questsUrl: string = 'https://sidequest.rcade.game/quests';
  protected page: Page;
  protected browser: Browser;

  constructor(
    protected queuesManager: ProjectQueuesManagerService,
    protected adsPowerApiService: AdsPowerApiService,
  ) {
    super(queuesManager);
  }

  protected handleJob(job: Job): Promise<any> {
    const { profile, userId, keepOpenProfile } = job.data;

    this.profile = profile;
    this.userId = userId;
    this.keepOpenProfile = keepOpenProfile;

    return this.run();
  }

  private async run() {
    try {
      this.browser = await this.adsPowerApiService.connectToPuppeteer(
        this.profile.id,
        this.userId,
      );
      this.page = await this.browser.newPage();

      try {
        await this.startQuests();
      } finally {
        await this.page.close();

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

  private async startQuests(): Promise<void> {
    await this.page.goto(this.questsUrl, { waitUntil: 'networkidle2' });
    await this.page.locator('.missions').wait();

    await wait(1012, 5012);

    const scenario = getRandomArrayElement([1, 2, 3]);
    await this.runScenario(scenario);
  }

  private async runScenario(scenario: number) {
    const scroller = new PageScroller({
      page: this.page,
      scrollableTag: 'html',
    });

    switch (scenario) {
      case 1:
        await scroller.scrollToElement('.mission-list');
        await wait(1593, 3021);
        await scroller.scrollToTop({ minDistance: 102, maxDistance: 423 });
        await this.completeDailyQuest();
        await wait(1242, 4512);
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await this.completeCommonQuests();
        break;

      case 2:
        await this.completeDailyQuest();
        await wait(3242, 5512);
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await this.completeCommonQuests();
        break;

      case 3:
        await scroller.scrollToElement('.mission-list');
        await wait(1242, 4512);
        await this.completeCommonQuests();
        await wait(1242, 2512);
        await scroller.scrollToTop({ minDistance: 102, maxDistance: 423 });
        await wait(1242, 2512);
        await this.completeDailyQuest();
        break;

      default:
        throw new Error('Unknown scenario');
    }
  }

  private async completeDailyQuest() {
    try {
      const button = await this.page.$('.spin-container .spin-content button');

      if (!button) {
        return;
      }

      await hoverAndClick(button);

      const modalSpinBtn = this.page.locator('.modal-content button.spin-btn');
      await modalSpinBtn.wait();
      await wait(1051, 5012);
      await hoverAndClick(modalSpinBtn);

      await this.page.locator('.rewards .reward-points').wait();
      await wait(1051, 5012);

      const closeBtn = this.page.locator(
        '.modal .modal-container .modal-content button.close-btn',
      );
      await hoverAndClick(closeBtn);
    } catch (error) {
      throw error;
    }
  }

  private async completeCommonQuests() {
    try {
      await this.page.waitForSelector('.mission-list');
      const pageTarget = this.page.target();

      const buttonHandles = await this.page.evaluateHandle(() => {
        const missionElements = document.querySelectorAll('.mission');

        return Array.from(missionElements)
          .filter((mission) => {
            const isCompleted = mission.classList.contains('completed');
            const title = mission
              .querySelector('.title')
              .textContent.trim()
              .toLowerCase();

            return (
              !isCompleted &&
              !title.includes('wallet') &&
              !title.includes('login with telegram')
            );
          })
          .map((mission) => mission.querySelector('button'));
      });

      const buttons = await buttonHandles.getProperties();

      if (buttons.size === 0) {
        return;
      }

      for (const buttonHandle of buttons.values()) {
        if (buttonHandle) {
          const elementHandle = buttonHandle.asElement();

          if (!elementHandle) {
            continue;
          }

          const buttonLocator = elementHandle as ElementHandle;

          await buttonLocator.hover();
          await wait(212, 563);
          await buttonLocator.click();

          await this.page.waitForSelector(
            '.mission-details .btn-container button',
          );
          const redirectBtn = this.page.locator(
            '.mission-details .btn-container button',
          );
          await hoverAndClick(redirectBtn);

          const newTarget = await this.browser.waitForTarget(
            (target) => target.opener() === pageTarget,
          );
          const newPage = await newTarget.page();

          if (newPage) {
            await wait(1421, 3012);
            await newPage.close();
          }

          await this.page.bringToFront();
          await this.page.waitForSelector('.rewards .congratulations');
          await wait(1224, 4012);
          await hoverAndClick(await this.page.locator('.modal .close-btn'));

          await wait(2016, 5921);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
