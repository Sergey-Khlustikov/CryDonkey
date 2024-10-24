import {Job, JobType, ObliterateOpts, Queue, QueueOptions, Worker} from "bullmq";
import RedisConnection from "#src/config/redis.js";
import {Redis} from "ioredis";
import minuteToMs from "#src/helpers/minuteToMs";
import getRandomNumberBetween from "#src/helpers/getRandomNumberBetween";

class BaseQueue {
  queueName: string;
  connection: Redis;
  queue: Queue;

  constructor(queueName: string, opts: Partial<QueueOptions> = {}) {
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

  async addJobs(jobs: any): Promise<Job[]> {
    return this.queue.addBulk(jobs);
  }

  async getJobs(statuses: JobType[]) {
    return this.queue.getJobs(statuses);
  }

  async getJob(id: string) {
    return this.queue.getJob(id);
  }

  async obliterate(opts: ObliterateOpts) {
    return this.queue.obliterate(opts);
  }

  async retryJobs() {
    return this.queue.retryJobs();
  }

  async removeJob(id: string) {
    return this.queue.remove(id);
  }

  calculateJobDelay(minDelayMinutes: number, maxDelayMinutes: number, index: number): number {
    if (index === 0) {
      return 0;
    }

    const baseDelayMs: number = minuteToMs(1);
    const randomDelayMs: number = getRandomNumberBetween(minuteToMs(minDelayMinutes), minuteToMs(maxDelayMinutes));

    return (baseDelayMs + randomDelayMs) * index;
  }
}

export default BaseQueue;
