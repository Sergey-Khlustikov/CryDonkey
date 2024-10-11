import BaseQueue from '../../queues/BaseQueue';
import QUEUE_NAMES from '../../../structures/queueNames';
import minuteToMs from '../../../helpers/minuteToMs';
import getRandomNumberBetween from '../../../helpers/getRandomNumberBetween';
import SwanJob from '../jobs/SwanJob';

class SwanQueue extends BaseQueue {
  constructor() {
    super(QUEUE_NAMES.swan, {
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
      await new SwanJob(job, job.data).run();
    });
  }

  async addJobs(SwanRunDTO) {
    const profiles = SwanRunDTO.getProfiles();

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {
          profile,
          onlyDaily: SwanRunDTO.getOnlyDaily(),
          dailyCombo: SwanRunDTO.getDailyCombo(),
          keepOpenProfileIds: SwanRunDTO.getKeepOpenProfileIds(),
          commentQuests: SwanRunDTO.getCommentQuestsByProfileId(profile.id),
          commentAutomationType: SwanRunDTO.getCommentAutomationType(),
        },
        opts: {
          delay: this.calculateJobDelay(SwanRunDTO.getMinDelayMinutes(), SwanRunDTO.getMaxDelayMinutes(), index),
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

export default new SwanQueue();
