// @ts-nocheck
import shuffleArray from "#src/helpers/shuffleArray.js";
import SwanQueue from "#src/domains/swan/queues/SwanQueue.js";
import SwanRunDTO from "#src/domains/swan/dto/SwanRunDTO.js";
import SWAN_COMMENT_AUTOMATION_TYPES from "#src/domains/swan/structures/SwanCommentAutomationTypes.js";

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
