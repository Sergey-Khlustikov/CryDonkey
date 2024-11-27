import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import BaseQueue from "#src/domains/queues/BaseQueue.js";
import BlumJob from "#src/domains/automatization/blum/jobs/BlumJob.js";
import BlumRunDTO from "#src/domains/automatization/blum/dto/BlumRunDTO.js";
import IBlumJobOptions from "#src/domains/automatization/blum/interfaces/IBlumJobOptions.js";

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

    this.initWorker(async (job: IBlumJobOptions) => {
      await new BlumJob(job).run();
    });
  }

  async addJobs(dto: BlumRunDTO) {
    const profiles = dto.getProfiles();

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {
          profile,
          keepOpenProfileIds: dto.getKeepOpenProfileIds(),
          options: dto.getOptions(),
        },
        opts: {
          delay: this.calculateJobDelay(dto.getMinDelayMinutes(), dto.getMaxDelayMinutes(), index),
        },
      };
    });

    return super.addJobs(formattedJobs);
  }
}

export default new BlumQueue();
