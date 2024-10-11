import {JobType, ObliterateOpts, Queue, Worker} from "bullmq";
import RedisConnection from "#src/config/redis.js";
import {Redis} from "ioredis";

class BaseQueue {
  queueName: string;
  connection: Redis;
  queue: Queue;

  constructor(queueName: string, opts = {}) {
    this.queueName = queueName;
    this.connection = RedisConnection.getConnection();
    this.queue = new Queue(queueName, {
      ...opts,
      connection: this.connection,
    });
  }

  initWorker(workerFunction: any) {
    new Worker(this.queueName, workerFunction, {connection: this.connection});
  }

  async addJobs(jobs: any) {
    await this.queue.addBulk(jobs);
  }

  async getJobs(statuses: JobType[]) {
    return await this.queue.getJobs(statuses);
  }

  async getJob(id: string) {
    return await this.queue.getJob(id);
  }

  async obliterate(opts: ObliterateOpts) {
    return await this.queue.obliterate(opts);
  }

  async retryJobs() {
    return await this.queue.retryJobs();
  }

  async removeJob(id: string) {
    return await this.queue.remove(id);
  }
}

export default BaseQueue;
