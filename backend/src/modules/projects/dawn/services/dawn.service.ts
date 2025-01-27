import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { InjectQueue } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { Queue } from 'bullmq';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import { DawnCheckAuthDto } from '@src/modules/projects/dawn/dto/dawn-check-auth.dto.js';

export class DawnService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.DawnAuth) queue: Queue) {
    super(queue);
  }

  async addCheckAuthJobs(dto: DawnCheckAuthDto, authUser: IAuthUser) {
    const formattedJobs = dto.profiles.map((profile) => {
      return {
        name: EQueueNames.DawnAuth,
        data: {
          profile,
          userId: authUser._id,
        },
      };
    });

    return this.addBulk(formattedJobs);
  }
}
