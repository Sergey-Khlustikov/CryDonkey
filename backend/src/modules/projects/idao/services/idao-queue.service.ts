import { Injectable } from '@nestjs/common';
import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { InjectQueue } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { Queue } from 'bullmq';
import { IdaoRunDTO } from '@src/modules/projects/idao/dto/idao-run.dto.js';
import shuffleArray from '@src/common/helpers/shuffleArray.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Injectable()
export class IdaoQueueService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.Idao) queue: Queue) {
    super(queue);
  }

  async addJobs(dto: IdaoRunDTO, authUser: IAuthUser) {
    const profiles = shuffleArray(dto.profiles);

    const formattedJobs = profiles.map((profile, index: number) => {
      return {
        name: EQueueNames.Idao,
        data: {
          profile,
          userId: authUser._id,
          keepOpenProfile: dto.keepOpenProfileIds.includes(profile.id),
          forecastOptions: {
            minTargetPriceDeviation: dto.minTargetPriceDeviation,
            maxTargetPriceDeviation: dto.maxTargetPriceDeviation,
          },
        },
        opts: {
          delay: this.calculateJobDelay(
            dto.minDelayMinutes,
            dto.maxDelayMinutes,
            index,
          ),
        },
      };
    });

    return this.addBulk(formattedJobs);
  }
}
