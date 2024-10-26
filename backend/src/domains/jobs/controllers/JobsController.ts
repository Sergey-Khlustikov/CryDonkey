import RcadeQueue from "#src/domains/rcade/queues/RcadeQueue.js";
import JobResource from "#src/domains/jobs/resources/JobResource.js";
import QUEUE_NAMES from "#src/structures/queueNames.js";
import SwanQueue from "#src/domains/swan/queues/SwanQueue.js";
import TwitterPostQueue from "#src/domains/twitter/queues/TwitterPostQueue.js";
import BlumQueue from "#src/domains/automatization/blum/queues/BlumQueue.js";
import BaseQueue from "#src/domains/queues/BaseQueue";
import IdaoQueue from "#src/domains/automatization/idao/queues/IdaoQueue";
import {Request, Response} from "express";

class JobsController {
  private allQueues: BaseQueue[] = [RcadeQueue, SwanQueue, TwitterPostQueue, BlumQueue, IdaoQueue];

  async getList(req: Request, res: Response) {
    try {
      const {status} = req.query;
      const statuses = status ? [status] : [];

      const jobs = [];

      for (const queue of this.allQueues) {
        const response = await queue.getJobs(statuses);
        jobs.push(...response);
      }

      const filteredJobs = jobs.sort((a, b) => b.id - a.id);

      res.status(200).json(await new JobResource(filteredJobs).getFormatted());
    } catch (e) {
      res.status(500).json({message: e.message});
    }
  }

  async retryJob(req: Request, res: Response) {
    try {
      const {id} = req.params;

      let queue;

      switch (req.body.queueName) {
        case QUEUE_NAMES.rcade:
          queue = RcadeQueue;
          break;

        case QUEUE_NAMES.swan:
          queue = SwanQueue;
          break;

        case QUEUE_NAMES.twitterPost:
          queue = TwitterPostQueue;
          break;

        case QUEUE_NAMES.blum:
          queue = BlumQueue;
          break;

        case QUEUE_NAMES.idao:
          queue = IdaoQueue;
          break

        default:
          return res.status(500).json({message: 'Unknown queue name'});
      }

      const job = await queue.getJob(id);

      if (!job) {
        return res.status(404).json({error: 'Job not found'});
      }

      await job.retry();

      res.status(200).json({message: 'Job retried successfully', jobId: job.id});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }

  async removeJob(req, res) {
    try {
      const {id} = req.params;

      let queue;

      switch (req.query.queueName) {
        case QUEUE_NAMES.rcade:
          queue = RcadeQueue;
          break;

        case QUEUE_NAMES.swan:
          queue = SwanQueue;
          break;

        case QUEUE_NAMES.twitterPost:
          queue = TwitterPostQueue;
          break;

        case QUEUE_NAMES.blum:
          queue = BlumQueue;
          break;

        case QUEUE_NAMES.idao:
          queue = IdaoQueue
          break
      }

      await queue.removeJob(id);

      res.status(200).json({message: 'Job removed successfully'});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }

  async retryFailed(req, res) {
    try {
      for (const queue of this.allQueues) {
        await queue.retryJobs({state: 'failed'});
      }

      res.status(200).json({message: 'Success'});
    } catch (e) {
      res.status(500).json({message: e.message});
    }
  }

  async deleteAll(req, res) {
    try {
      for (const queue of this.allQueues) {
        await queue.obliterate({force: true});
      }

      res.status(200).json({message: 'Success'});
    } catch (e) {
      res.status(500).json({message: e.message});
    }
  }
}

export default new JobsController();
