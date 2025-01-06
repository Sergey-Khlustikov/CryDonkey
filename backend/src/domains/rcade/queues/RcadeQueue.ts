import BaseQueue from "#src/domains/queues/BaseQueue.js";
import {run} from '#src/automatization/rcade/rcade.js';
import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import {Job} from "bullmq";
import {getAuthUser} from "#src/middlewares/authMiddleware.js";

class RcadeQueue extends BaseQueue {
  constructor() {
    super(EQueueNames.Rcade, {
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

  async addJobs(data): Promise<Job[]> {
    const {minDelayMinutes, maxDelayMinutes, keepOpenProfileIds} = data;

    const formattedJobs = data.profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {userId: getAuthUser().id, profile, keepOpenProfileIds},
        opts: {
          delay: index === 0 ? 0 : this.calculateJobDelay(minDelayMinutes, maxDelayMinutes, index),
        },
      };
    });

    return super.addJobs(formattedJobs);
  }
}

export default new RcadeQueue();
