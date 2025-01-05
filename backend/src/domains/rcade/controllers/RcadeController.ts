import shuffleArray from "#src/helpers/shuffleArray.js";
import RcadeQueue from "#src/domains/rcade/queues/RcadeQueue.js";
import {Request, Response} from "express";

class RcadeController {
  async run(request: Request, response: Response) {
    try {
      const {minDelayMinutes = 1, maxDelayMinutes = 5, keepOpenProfileIds} = request.body;
      const profiles = shuffleArray(request.body.profiles);

      await RcadeQueue.addJobs({profiles, minDelayMinutes, maxDelayMinutes, keepOpenProfileIds});

      response.status(200).send({message: 'Success'});
    } catch (error) {
      response.status(500).send({message: error.message});
    }
  }
}

export default new RcadeController();
