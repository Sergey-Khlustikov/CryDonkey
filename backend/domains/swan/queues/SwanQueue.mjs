import BaseQueue from '../../queues/BaseQueue.mjs';
import {run} from '../../../automatization/swan/swan.mjs';
import QUEUE_NAMES from '../../../structures/queueNames.mjs';
import minuteToMs from '../../../helpers/minuteToMs.mjs';
import getRandomNumberBetween from '../../../helpers/getRandomNumberBetween.mjs';

class SwanQueue extends BaseQueue {
  constructor() {
    super(QUEUE_NAMES.swan, {
      removeOnComplete: true,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    this.initWorker(async (job) => {
      console.log('job.data', job.data);
      await run(job.data);
    });
  }

  async addJobs(data) {
    const {
      profiles,
      minDelayMinutes,
      maxDelayMinutes,
      onlyDaily,
      dailyFirst,
      dailySecond,
      dailyThird,
      keepOpenProfileIds,
    } = data;

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {profile, onlyDaily, dailyFirst, dailySecond, dailyThird, keepOpenProfileIds},
        opts: {
          delay: index === 0 ? 0 : this.calculateJobDelay(minDelayMinutes, maxDelayMinutes, index),
        },
      };
    });

    await super.addJobs(formattedJobs);
  }

  calculateJobDelay(minDelayMinutes, maxDelayMinutes, index) {
    const baseDelayMs = minuteToMs(1);
    const randomDelayMs = getRandomNumberBetween(minuteToMs(minDelayMinutes), minuteToMs(maxDelayMinutes));

    return (baseDelayMs + randomDelayMs) * index;
  }
}

export default new SwanQueue();
