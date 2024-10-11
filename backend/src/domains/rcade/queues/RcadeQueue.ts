// @ts-nocheck
import BaseQueue from "#src/domains/queues/BaseQueue.js";
import {run} from '#src/automatization/rcade/rcade.js';
import QUEUE_NAMES from "#src/structures/queueNames.js";
import minuteToMs from "#src/helpers/minuteToMs.js";
import getRandomNumberBetween from "#src/helpers/getRandomNumberBetween.js";

class RcadeQueue extends BaseQueue {
  constructor() {
    super(QUEUE_NAMES.rcade, {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    this.initWorker(async (job) => {
      await run(job.data);
    });
  }

  async addJobs(data) {
    const {minDelayMinutes, maxDelayMinutes, keepOpenProfileIds} = data;

    const formattedJobs = data.profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {profile, keepOpenProfileIds},
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

export default new RcadeQueue();
