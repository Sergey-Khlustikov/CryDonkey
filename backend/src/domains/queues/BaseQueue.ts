import {DelayedError, Job, JobType, ObliterateOpts, Queue, QueueOptions, Worker} from "bullmq";
import RedisConnection from "#src/config/redis.js";
import {Redis} from "ioredis";
import minuteToMs from "#src/helpers/minuteToMs.js";
import getRandomNumberBetween from "#src/helpers/getRandomNumberBetween.js";
import EQueueNames from "#src/domains/queues/structures/enums/EQueueNames.js";

class BaseQueue {
  queueName: EQueueNames;
  connection: Redis;
  queue: Queue;

  constructor(queueName: EQueueNames, opts: Partial<QueueOptions> = {}) {
    this.queueName = queueName;
    this.connection = RedisConnection.getConnection();
    this.queue = new Queue(queueName, {
      ...opts,
      connection: this.connection,
    });
  }

  initWorker(workerFunction: any): void {
    new Worker(this.queueName, async (job: Job, token: string | undefined) => {
      if (await this.profileHasActiveJobInOtherQueues(job.data.profile.id)) {
        await job.moveToDelayed(Date.now() + minuteToMs(2), token);

        throw new DelayedError();
      }

      await workerFunction(job)
    }, {connection: this.connection});
  }

  async addJobs(jobs: any): Promise<Job[]> {
    return this.queue.addBulk(jobs);
  }

  async getJobs(statuses: JobType[]) {
    return this.queue.getJobs(statuses);
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.queue.getJob(id);
  }

  async obliterate(opts: ObliterateOpts): Promise<void> {
    return this.queue.obliterate(opts);
  }

  async retryJobs(): Promise<void> {
    return this.queue.retryJobs();
  }

  async removeJob(id: string): Promise<number> {
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

  async profileHasActiveJobInOtherQueues(profileId: string): Promise<boolean> {
    const queueNames = Object.values(EQueueNames).filter(queue => queue !== this.queueName);

    for (const name of queueNames) {
      const queue = new Queue(name, {connection: this.connection});
      const activeJobs = await queue.getJobs(['active']);

      if (activeJobs.some(job => job.data.profile.id === profileId)) {
        return true;
      }
    }

    return false;
  }
}

export default BaseQueue;
