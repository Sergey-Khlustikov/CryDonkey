import QUEUE_NAMES from '../../../../structures/queueNames.mjs';
import BaseQueue from '../../../queues/BaseQueue.mjs';
import BlumJob from '../jobs/BlumJob.mjs';
import minuteToMs from '../../../../helpers/minuteToMs.mjs';
import getRandomNumberBetween from '../../../../helpers/getRandomNumberBetween.mjs';

class BlumQueue extends BaseQueue {
  constructor() {
    super(QUEUE_NAMES.blum, {
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
      await new BlumJob(job, job.data).run();
    });
  }

  async addJobs(BlumRunDTO) {
    const profiles = BlumRunDTO.getProfiles();

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {
          profile,
          keepOpenProfileIds: BlumRunDTO.getKeepOpenProfileIds(),
        },
        opts: {
          delay: this.calculateJobDelay(BlumRunDTO.getMinDelayMinutes(), BlumRunDTO.getMaxDelayMinutes(), index),
        },
      };
    });

    await super.addJobs(formattedJobs);
  }

  calculateJobDelay(minDelayMinutes, maxDelayMinutes, index) {
    if (index === 0) {
      return 0;
    }

    const baseDelayMs = minuteToMs(1);
    const randomDelayMs = getRandomNumberBetween(minuteToMs(minDelayMinutes), minuteToMs(maxDelayMinutes));

    return (baseDelayMs + randomDelayMs) * index;
  }
}

export default new BlumQueue();
