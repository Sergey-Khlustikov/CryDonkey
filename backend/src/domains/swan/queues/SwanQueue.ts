// @ts-nocheck
import BaseQueue from "#src/domains/queues/BaseQueue.js";
import QUEUE_NAMES from "#src/structures/queueNames.js";
import SwanJob from "#src/domains/swan/jobs/SwanJob.js";

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

    return super.addJobs(formattedJobs);
  }
}

export default new SwanQueue();
