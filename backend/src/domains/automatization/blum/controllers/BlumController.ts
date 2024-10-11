import BlumQueue from '../queues/BlumQueue';
import BlumRunDTO from '../dto/BlumRunDTO';
import shuffleArray from '../../../../automatization/helpers/shuffleArray';
import {Request, Response} from "express";

class BlumController {
  async run(req: Request, res: Response): Promise<void> {
    try {
      const params = req.body;

      await BlumQueue.addJobs(new BlumRunDTO({
        profiles: shuffleArray(params.profiles),
        minDelayMinutes: params.minDelayMinutes || 1,
        maxDelayMinutes: params.maxDelayMinutes || 5,
        keepOpenProfileIds: params.keepOpenProfileIds,
      }));

      res.status(200).send({message: 'Success'});
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({message: error.message});
      } else {
        res.status(500).send({message: 'An unknown error occurred.'});
      }
    }
  }
}

export default new BlumController();
