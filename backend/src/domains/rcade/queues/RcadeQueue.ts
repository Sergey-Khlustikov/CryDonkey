import BaseQueue from "#src/domains/queues/BaseQueue.js";
import {run} from '#src/automatization/rcade/rcade.js';
import QUEUE_NAMES from "#src/structures/queueNames.js";
import {Job} from "bullmq";

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

  async addJobs(data): Promise<Job[]> {
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

    return super.addJobs(formattedJobs);
  }
}

export default new RcadeQueue();
