import { AutomationProjectService } from '@src/common/queues/automation-project.service.js';
import { InjectQueue } from '@nestjs/bullmq';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';
import { Queue } from 'bullmq';
import { TwitterWritePostDTO } from '@src/modules/twitter/dto/twitter.write-post.dto.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import shuffleArray from '@src/common/helpers/shuffleArray.js';

export class TwitterQueuesService extends AutomationProjectService {
  constructor(@InjectQueue(EQueueNames.TwitterPost) twitterPostQueue: Queue) {
    super(twitterPostQueue);
  }

  async addJobs(dto: TwitterWritePostDTO, authUser: IAuthUser) {
    const profiles = shuffleArray(dto.profiles);

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: EQueueNames.TwitterPost,
        data: {
          profile,
          post: dto.posts.find((post) => post.profileId === profile.id)?.post,
          automationType: dto.automationType,
          keepOpenProfile: dto.keepOpenProfileIds.includes(profile.id),
          userId: authUser._id,
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
