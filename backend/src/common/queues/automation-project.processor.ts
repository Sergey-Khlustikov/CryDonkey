import { WorkerHost } from '@nestjs/bullmq';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { DelayedError, Job } from 'bullmq';
import minuteToMs from '@src/common/helpers/minuteToMs.js';
import { EQueueNames } from '@crydonkey/shared';

export abstract class AutomationProjectProcessor extends WorkerHost {
  protected abstract readonly queueName: EQueueNames;

  protected abstract handleJob(job: Job): Promise<any>;

  protected constructor(
    protected readonly queuesManager: ProjectQueuesManagerService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    await this.beforeJob(job, token);
    return this.handleJob(job);
  }

  protected async beforeJob(job: Job, token?: string): Promise<void> {
    const profileId = job.data?.profile?.id;

    if (!profileId) {
      throw new Error('Profile id not specified');
    }

    const hasActiveJob =
      await this.queuesManager.profileHasActiveJobInOtherQueues(profileId, [
        this.queueName,
      ]);

    if (hasActiveJob) {
      await job.moveToDelayed(Date.now() + minuteToMs(2), token);

      throw new DelayedError();
    }
  }
}
