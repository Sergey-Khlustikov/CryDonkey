import BaseQueue from './BaseQueue.mjs';
import minuteToMs from '../../helpers/minuteToMs.mjs';
import getRandomNumberBetween from '../../helpers/getRandomNumberBetween.mjs';
import { startQuests as startRcade } from '../../automatization/rcade/rcade.mjs';
import { startQuests as startSwan } from '../../automatization/swan/swan.mjs';
import AdsApi from '../../api/AdsApi.mjs';

// TEMP SOLUTION
class CustomQueue extends BaseQueue {
  constructor() {
    super('Rcade/Swan', {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    this.initWorker(async (job) => {
      try {
        const browser = await AdsApi.connectToPuppeteer(job.data.profile.id);

        try {
          await startRcade({ browser });
          await startSwan({ ...job.data.swanOptions, browser });
        } finally {
          await browser.close();
        }

      } catch (e) {
        throw e;
      }
    });
  }

  async addJobs(data) {
    const { minDelayMinutes, maxDelayMinutes, rcadeOptions, swanOptions } = data;

    const formattedJobs = data.profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: { profile, rcadeOptions, swanOptions },
        opts: {
          delay: index === 0 ? 0 : this.calculateJobDelay(minDelayMinutes, maxDelayMinutes, index),
        },
      };
    });

    await super.addJobs(formattedJobs);
  }

  calculateJobDelay(minDelayMinutes, maxDelayMinutes, index) {
    const baseDelayMs = minuteToMs(2);
    const randomDelayMs = getRandomNumberBetween(minuteToMs(minDelayMinutes), minuteToMs(maxDelayMinutes));

    return (baseDelayMs + randomDelayMs) * index;
  }
}

export default new CustomQueue();
