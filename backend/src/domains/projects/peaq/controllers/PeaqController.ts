import shuffleArray from "#src/helpers/shuffleArray.js";
import {Request, Response} from "express";
import PeaqQueue from "#src/domains/projects/peaq/queues/PeaqQueue.js";
import PeaqDTO from "#src/domains/projects/peaq/dto/PeaqDTO.js";

class PeaqController {
  async run(req: Request, res: Response) {
    try {
      const params = req.body;

      await PeaqQueue.addJobs(new PeaqDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        keepOpenProfileIds: params.keepOpenProfileIds,
        part: req.params.part
      }));

      res.status(200).send({message: 'Success'});
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({message: error.message});
      } else {
        res.status(500).send({message: 'An unknown error occurred'});
      }
    }
  }
}

export default new PeaqController();
