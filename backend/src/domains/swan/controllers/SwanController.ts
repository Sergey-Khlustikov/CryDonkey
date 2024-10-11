import shuffleArray from '../../../automatization/helpers/shuffleArray';
import SwanQueue from '../queues/SwanQueue';
import SwanRunDTO from '../dto/SwanRunDTO';
import SWAN_COMMENT_AUTOMATION_TYPES from '../structures/SwanCommentAutomationTypes';

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
        automationType: params.commentSettings.automationType || SWAN_COMMENT_AUTOMATION_TYPES.skip,
        commentQuests: params.commentSettings.quests || null,
      }));

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new SwanController();
