import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BlumRunDto } from '@src/modules/projects/blum/dto/blum-run.dto.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import shuffleArray from '@src/common/helpers/shuffleArray.js';
import { EQueueNames } from '@crydonkey/shared';

@Injectable()
export class BlumService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.Blum) queue: Queue) {
    super(queue);
  }

  async addJobs(dto: BlumRunDto, authUser: IAuthUser) {
    const profiles = shuffleArray(dto.profiles);

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: EQueueNames.Blum,
        data: {
          profile,
          userId: authUser._id,
          keepOpenProfile: dto.keepOpenProfileIds.includes(profile.id),
          options: dto.options,
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
