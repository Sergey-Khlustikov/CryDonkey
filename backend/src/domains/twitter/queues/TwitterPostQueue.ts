// @ts-nocheck
import BaseQueue from "#src/domains/queues/BaseQueue.js";
import QUEUE_NAMES from "#src/structures/queueNames.js";
import TwitterPostJob from "#src/domains/twitter/jobs/TwitterPostJob.js";

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

    return super.addJobs(formattedJobs);
  }
}

export default new TwitterPostQueue();
