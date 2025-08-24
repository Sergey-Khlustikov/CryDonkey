import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { RabbyUnlockDto } from '@src/modules/extensions/rabby/dto/rabby-unlock.dto.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { Queue } from 'bullmq';
import { EQueueNames } from '@crydonkey/shared';

@Injectable()
export class RabbyQueueService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.RabbyUnlock) queue: Queue) {
    super(queue);
  }

  async addUnlockJobs(dto: RabbyUnlockDto, authUser: IAuthUser) {
    const formattedJobs = dto.profiles.map((profile) => {
      return {
        name: EQueueNames.RabbyUnlock,
        data: {
          profile,
          userId: authUser._id,
        },
      };
    });

    return this.addBulk(formattedJobs);
  }
}
