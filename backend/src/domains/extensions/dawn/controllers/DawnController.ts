import shuffleArray from "#src/helpers/shuffleArray.js";
import {Request, Response} from "express";
import DawnCheckAuthQueue from "#src/domains/extensions/dawn/queues/DawnCheckAuthQueue.js";

class DawnController {
  async checkAuth(req: Request, res: Response) {
    try {
      const params = req.body;
      await DawnCheckAuthQueue.addJobs({
        profiles: shuffleArray(params.profiles),
      });

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

export default new DawnController();
