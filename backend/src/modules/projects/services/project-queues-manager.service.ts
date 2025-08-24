import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { RetryJobDto } from '@src/modules/projects/dto/retry-job.dto.js';
import { RemoveJobDto } from '@src/modules/projects/dto/remove-job.dto.js';
import { EQueueNames } from '@crydonkey/shared';

@Injectable()
export class ProjectQueuesManagerService {
  private readonly queues: Queue[];

  constructor(
    @InjectQueue(EQueueNames.Idao) idaoQueue: Queue,
    @InjectQueue(EQueueNames.Rcade) rcadeQueue: Queue,
    @InjectQueue(EQueueNames.DawnAuth) dawnQueue: Queue,
    @InjectQueue(EQueueNames.Blum) blumQueue: Queue,
    @InjectQueue(EQueueNames.TwitterPost) twitterQueue: Queue,
    @InjectQueue(EQueueNames.RabbyUnlock) rabbyUnlockQueue: Queue,
  ) {
    this.queues = [
      idaoQueue,
      rcadeQueue,
      dawnQueue,
      blumQueue,
      twitterQueue,
      rabbyUnlockQueue,
    ];
  }

  async getList() {
    const jobs = [];

    for (const queue of this.queues) {
      const response = await queue.getJobs();
      jobs.push(...response);
    }

    return jobs.sort((a, b) => b.id - a.id);
  }

  async retryJobByIdAndQueueName(dto: RetryJobDto): Promise<void> {
    const queue = this.queues.find((queue) => queue.name === dto.queueName);

    if (!queue) {
      throw new NotFoundException(`Queue with name ${dto.queueName} not found`);
    }

    const job = await queue.getJob(dto.id);

    if (!job) {
      throw new NotFoundException(`Job with id ${dto.id} not found`);
    }

    await job.retry();
  }

  async removeJobByIdAndQueueName(dto: RemoveJobDto): Promise<void> {
    const queue = this.queues.find((queue) => queue.name === dto.queueName);

    if (!queue) {
      throw new NotFoundException(`Queue with name ${dto.queueName} not found`);
    }

    await queue.remove(dto.id);
  }

  async retryFailed(): Promise<void> {
    for (const queue of this.queues) {
      await queue.retryJobs();
    }
  }

  async deleteAll(): Promise<void> {
    for (const queue of this.queues) {
      await queue.obliterate({ force: true });
    }
  }

  async profileHasActiveJobInOtherQueues(
    profileId: string,
    excludedQueueNames: string[],
  ): Promise<boolean> {
    for (const queue of this.queues) {
      if (excludedQueueNames.includes(queue.name)) {
        continue;
      }

      const activeJobs = await queue.getJobs(['active']);

      if (activeJobs.some((job) => job.data.profile.id === profileId)) {
        return true;
      }
    }

    return false;
  }
}
