import { Job, JobType, Queue } from 'bullmq';
import minuteToMs from '@src/common/helpers/minuteToMs.js';
import getRandomNumberBetween from '@src/common/helpers/getRandomNumberBetween.js';
import { NotFoundException } from '@nestjs/common';

export abstract class AutomationProjectService {
  protected constructor(protected readonly queue: Queue) {}

  async addBulk(jobs): Promise<Job[]> {
    return this.queue.addBulk(jobs);
  }

  async getJobs(statuses: JobType[]): Promise<Job[]> {
    return this.queue.getJobs(statuses);
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.queue.getJob(id);
  }

  async obliterate(opts: any): Promise<void> {
    return this.queue.obliterate(opts);
  }

  async retryJobs(): Promise<void> {
    return this.queue.retryJobs();
  }

  async removeJob(id: string): Promise<number> {
    return this.queue.remove(id);
  }

  async retryJob(id: string): Promise<void> {
    const job = await this.queue.getJob(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    await job.retry();
  }

  calculateJobDelay(
    minDelayMinutes: number,
    maxDelayMinutes: number,
    index: number,
  ): number {
    if (index === 0) {
      return 0;
    }

    const baseDelayMs: number = minuteToMs(1);
    const randomDelayMs: number = getRandomNumberBetween(
      minuteToMs(minDelayMinutes),
      minuteToMs(maxDelayMinutes),
    );

    return (baseDelayMs + randomDelayMs) * index;
  }
}
