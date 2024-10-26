import shuffleArray from "#src/helpers/shuffleArray.js";
import {Request, Response} from "express";
import IdaoQueue from "#src/domains/automatization/idao/queues/IdaoQueue.js";
import IdaoDTO from "#src/domains/automatization/idao/dto/IdaoDTO.js";

class IdaoController {
  async run(req: Request, res: Response) {
    try {
      const params = req.body;

      await IdaoQueue.addJobs(new IdaoDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        keepOpenProfileIds: params.keepOpenProfileIds,
        forecastOptions: params.forecastOptions,
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

export default new IdaoController();
