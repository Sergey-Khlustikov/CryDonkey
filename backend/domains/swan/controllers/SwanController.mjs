import shuffleArray from '../../../automatization/helpers/shuffleArray.mjs';
import SwanQueue from '../queues/SwanQueue.mjs';
import SwanRunDTO from '../dto/SwanRunDTO.mjs';
import SWAN_COMMENT_AUTOMATION_TYPES from '../structures/swanCommentAutomationTypes.mjs';

class SwanController {
  async run(req, res) {
    try {
      const params = req.body;

      await SwanQueue.addJobs(new SwanRunDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        onlyDaily: params.onlyDaily,
        dailyCombo: params.dailyCombo,
        keepOpenProfileIds: params.keepOpenProfileIds,
        commentAutomationType: params.commentAutomationType || SWAN_COMMENT_AUTOMATION_TYPES.skip,
        commentQuests: params.commentQuests || null,
      }));

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new SwanController();
