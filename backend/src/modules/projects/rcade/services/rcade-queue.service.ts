import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { Queue } from 'bullmq';
import { RcadeRunDto } from '@src/modules/projects/rcade/dto/rcade-run.dto.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Injectable()
export class RcadeQueueService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.Rcade) queue: Queue) {
    super(queue);
  }

  async addJobs(dto: RcadeRunDto, authUser: IAuthUser) {
    const formattedJobs = dto.profiles.map((profile, index) => {
      return {
        name: EQueueNames.Rcade,
        data: {
          profile,
          userId: authUser._id,
          keepOpenProfile: dto.keepOpenProfileIds.includes(profile.id),
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
