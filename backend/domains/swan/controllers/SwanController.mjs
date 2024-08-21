import shuffleArray from '../../../automatization/helpers/shuffleArray.mjs';
import SwanQueue from '../queues/SwanQueue.mjs';

class SwanController {
  async run(req, res) {
    try {
      const params = req.body;
      const profiles = shuffleArray(params.profiles);

      await SwanQueue.addJobs({
        profiles,
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        onlyDaily: params.onlyDaily || true,
        dailyFirst: params.dailyFirst,
        dailySecond: params.dailySecond,
        dailyThird: params.dailyThird,
      });

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new SwanController();
