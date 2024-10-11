// @ts-nocheck
import shuffleArray from "#src/automatization/helpers/shuffleArray.js";
import RcadeQueue from "#src/domains/rcade/queues/RcadeQueue.js";

class RcadeController {
  async run(req, res) {
    try {
      const {minDelayMinutes = 1, maxDelayMinutes = 5, keepOpenProfileIds} = req.body;
      const profiles = shuffleArray(req.body.profiles);

      await RcadeQueue.addJobs({profiles, minDelayMinutes, maxDelayMinutes, keepOpenProfileIds});

      res.status(200).send({ message: 'Success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new RcadeController();
