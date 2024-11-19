import BaseQueue from "#src/domains/queues/BaseQueue.js";
import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";
import IdaoJob from "#src/domains/automatization/idao/jobs/IdaoJob.js";
import IdaoDTO from "#src/domains/automatization/idao/dto/IdaoDTO.js";
import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import IIdaoJobOptions from "#src/domains/automatization/idao/interfaces/IIdaoJobOptions.js";

class IdaoQueue extends BaseQueue {
  constructor() {
    super(EQueueNames.Idao, {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    })

    this.initWorker(async (job: IIdaoJobOptions) => {
      await new IdaoJob(job).run();
    });
  }

  async addJobs(dto: IdaoDTO) {
    const profiles = dto.getProfiles();

    const formattedJobs: IIdaoJobOptions[] = profiles.map((profile: IBaseJobProfile, index: number) => {
      return {
        name: this.queueName,
        data: {
          profile,
          keepOpenProfileIds: dto.getKeepOpenProfileIds(),
          forecastOptions: dto.getForecastOptions()
        },
        opts: {
          delay: this.calculateJobDelay(dto.getMinDelayMinutes(), dto.getMaxDelayMinutes(), index),
        },
      };
    });

    return super.addJobs(formattedJobs);
  }
}

export default new IdaoQueue()
