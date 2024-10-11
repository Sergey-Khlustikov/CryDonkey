import BaseQueue from '../../queues/BaseQueue';
import QUEUE_NAMES from '../../../structures/queueNames';
import minuteToMs from '../../../helpers/minuteToMs';
import getRandomNumberBetween from '../../../helpers/getRandomNumberBetween';
import TwitterPostJob from '../jobs/TwitterPostJob';

class TwitterPostQueue extends BaseQueue {
  constructor() {
    super(QUEUE_NAMES.twitterPost, {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    this.initWorker(async (job) => {
      await new TwitterPostJob(job, job.data).run();
    });
  }

  async addJobs(TwitterPostDTO) {
    const profiles = TwitterPostDTO.getProfiles();

    const formattedJobs = profiles.map((profile, index) => {
      return {
        name: this.queueName,
        data: {
          profile,
          post: TwitterPostDTO.getPosts().find(post => post.profileId === profile.id),
          automationType: TwitterPostDTO.getAutomationType(),
          keepOpenProfileIds: TwitterPostDTO.getKeepOpenProfileIds(),
        },
        opts: {
          delay: this.calculateJobDelay(TwitterPostDTO.getMinDelayMinutes(), TwitterPostDTO.getMaxDelayMinutes(), index),
        },
      };
    });

    await super.addJobs(formattedJobs);
  }

  calculateJobDelay(minDelayMinutes, maxDelayMinutes, index) {
    if (index === 0) {
      return 0;
    }

    const baseDelayMs = minuteToMs(1);
    const randomDelayMs = getRandomNumberBetween(minuteToMs(minDelayMinutes), minuteToMs(maxDelayMinutes));

    return (baseDelayMs + randomDelayMs) * index;
  }
}

export default new TwitterPostQueue();
