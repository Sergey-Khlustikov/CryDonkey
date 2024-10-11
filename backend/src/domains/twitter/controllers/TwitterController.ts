import shuffleArray from '../../../automatization/helpers/shuffleArray';
import TwitterPostQueue from '../queues/TwitterPostQueue';
import TwitterPostDTO from '../dto/TwitterPostDTO';
import {TWITTER_POST_AUTOMATION_TYPES} from '../structures/TwitterAutomationTypes';

class TwitterController {
  async writePost(req, res) {
    try {
      const params = req.body;

      await TwitterPostQueue.addJobs(new TwitterPostDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        keepOpenProfileIds: params.keepOpenProfileIds,
        automationType: params.automationType || TWITTER_POST_AUTOMATION_TYPES.auto,
        posts: params.posts || null,
      }));

      res.status(200).send({message: 'Success'});
    } catch (error) {
      res.status(500).send({message: error.message});
    }
  }
}

export default new TwitterController();
