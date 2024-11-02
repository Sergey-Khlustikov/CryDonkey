import BaseQueue from "#src/domains/queues/BaseQueue.js";
import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import DawnCheckAuthJob from "#src/domains/extensions/dawn/jobs/DawnCheckAuthJob.js";

class DawnCheckAuthQueue extends BaseQueue {
  constructor() {
    super(EQueueNames.DawnAuth, {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    })

    this.initWorker(async (job: IJobBulk) => {
      await new DawnCheckAuthJob(job).run();
    });
  }

  async addJobs(params: {
    profiles: { id: string, name: string }[]
  }) {
    const formattedJobs = params.profiles.map((profile) => {
      return {
        name: this.queueName,
        data: {
          profile,
        },
      };
    });

    return super.addJobs(formattedJobs);
  }
}

export default new DawnCheckAuthQueue()
