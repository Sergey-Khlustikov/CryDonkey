import { Queue, Worker } from 'bullmq';
import RedisConnection from '../../config/redis.mjs';

class BaseQueue {
  constructor(queueName, opts = {}) {
    this.queueName = queueName;
    this.connection = RedisConnection.getConnection();
    this.queue = new Queue(queueName, {
      ...opts,
      connection: this.connection,
    });
  }

  initWorker(workerFunction) {
    new Worker(this.queueName, workerFunction, { connection: this.connection });
  }

  async addJobs(jobs) {
    await this.queue.addBulk(jobs);
  }

  async getJobs(statuses) {
    return await this.queue.getJobs(statuses);
  }

  async getJob(id) {
    return await this.queue.getJob(id);
  }

  async obliterate(opts) {
    return await this.queue.obliterate(opts);
  }

  async retryJobs() {
    return await this.queue.retryJobs();
  }

  async removeJob(id) {
    return await this.queue.remove(id);
  }
}

export default BaseQueue;
