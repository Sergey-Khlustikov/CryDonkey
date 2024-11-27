import BaseQueue from "#src/domains/queues/BaseQueue.js";
import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import PeaqDTO from "#src/domains/projects/peaq/dto/PeaqDTO.js";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import PeaqJob from "#src/domains/projects/peaq/jobs/PeaqJob.js";

class PeaqQueue extends BaseQueue {
  constructor() {
    super(EQueueNames.Peaq, {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 1,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    })

    this.initWorker(async (job: IJobBulk) => {
      await new PeaqJob(job).run();
    });
  }

  async addJobs(dto: PeaqDTO) {
    const profiles = dto.getProfiles();

    const formattedJobs: IJobBulk[] = profiles.map((profile: IBaseJobProfile, index: number) => {
      return {
        name: this.queueName,
        data: {
          profile,
          keepOpenProfileIds: dto.getKeepOpenProfileIds(),
        },
        opts: {
          delay: this.calculateJobDelay(dto.getMinDelayMinutes(), dto.getMaxDelayMinutes(), index),
        },
      };
    });

    return super.addJobs(formattedJobs);
  }
}

export default new PeaqQueue()
