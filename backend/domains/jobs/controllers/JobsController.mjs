import RcadeQueue from '../../rcade/queues/RcadeQueue.mjs';
import JobResource from '../resources/JobResource.mjs';
import QUEUE_NAMES from '../../../structures/queueNames.mjs';
import SwanQueue from '../../swan/queues/SwanQueue.mjs';
import CustomQueue from '../../queues/CustomQueue.mjs';
import shuffleArray from '../../../automatization/helpers/shuffleArray.mjs';

class JobsController {
  async getList(req, res) {
    try {
      const { status, queue } = req.query;
      const statuses = status ? [status] : [];

      const allQueues = [RcadeQueue, SwanQueue, CustomQueue];
      const jobs = [];

      if (queue) {
        switch (queue) {
          case QUEUE_NAMES.rcade:
            const response = await RcadeQueue.getJobs(statuses);
            jobs.push(...response);
        }
      } else {
        for (const queue of allQueues) {
          const response = await queue.getJobs(statuses);
          jobs.push(...response);
        }
      }

      const filteredJobs = jobs.sort((a, b) => b.id - a.id);

      res.status(200).json(await new JobResource(filteredJobs).getFormatted());
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async retryJob(req, res) {
    try {
      const { id } = req.params;

      let queue;

      switch (req.body.queueName) {
        case QUEUE_NAMES.rcade:
          queue = RcadeQueue;
          break;

        case QUEUE_NAMES.swan:
          queue = SwanQueue;
          break;

        case QUEUE_NAMES.custom:
          queue = CustomQueue;
          break;
      }

      const job = await queue.getJob(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      await job.retry();

      res.status(200).json({ message: 'Job retried successfully', jobId: job.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeJob(req, res) {
    try {
      const { id } = req.params;

      let queue;

      switch (req.query.queueName) {
        case QUEUE_NAMES.rcade:
          queue = RcadeQueue;
          break;

        case QUEUE_NAMES.swan:
          queue = SwanQueue;
          break;

        case QUEUE_NAMES.custom:
          queue = CustomQueue;
          break;
      }

      await queue.removeJob(id);

      res.status(200).json({ message: 'Job removed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async retryFailed(req, res) {
    try {
      const queues = [RcadeQueue, SwanQueue, CustomQueue];

      for (const queue of queues) {
        await queue.retryJobs({ state: 'failed' });
      }

      res.status(200).json({ message: 'Success' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteAll(req, res) {
    try {
      const queues = [RcadeQueue, SwanQueue, CustomQueue];

      for (const queue of queues) {
        await queue.obliterate({ force: true });
      }

      res.status(200).json({ message: 'Success' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async runCustom(req, res) {
    try {
      await CustomQueue.addJobs({
        profiles: shuffleArray(req.body.profiles),
        minDelayMinutes: req.body.minDelayMinutes || 1,
        maxDelayMinutes: req.body.maxDelayMinutes || 5,
        rcadeOptions: req.body.rcadeOptions,
        swanOptions: req.body.swanOptions,
      });

      res.status(200).send({ message: 'Jobs added to a queue' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new JobsController();
