// @ts-nocheck
import shuffleArray from "#src/automatization/helpers/shuffleArray.js";
import TwitterPostQueue from "#src/domains/twitter/queues/TwitterPostQueue.js";
import TwitterPostDTO from "#src/domains/twitter/dto/TwitterPostDTO.js";
import {TWITTER_POST_AUTOMATION_TYPES} from "#src/domains/twitter/structures/TwitterAutomationTypes.js";

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
