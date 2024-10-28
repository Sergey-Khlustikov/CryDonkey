import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import BaseQueue from "#src/domains/queues/BaseQueue.js";
import BlumJob from "#src/domains/automatization/blum/jobs/BlumJob.js";

class BlumQueue extends BaseQueue {
  constructor() {
    super(EQueueNames.Blum, {
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

    return super.addJobs(formattedJobs);
  }
}

export default new BlumQueue();
