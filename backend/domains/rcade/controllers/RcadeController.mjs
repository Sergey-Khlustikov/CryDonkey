import shuffleArray from '../../../automatization/helpers/shuffleArray.mjs';
import RcadeQueue from '../queues/RcadeQueue.mjs';

class RcadeController {
  async run(req, res) {
    try {
      const { minDelayMinutes = 1, maxDelayMinutes = 5 } = req.body;
      const profiles = shuffleArray(req.body.profiles);

      await RcadeQueue.addJobs({ profiles, minDelayMinutes, maxDelayMinutes });

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new RcadeController();
