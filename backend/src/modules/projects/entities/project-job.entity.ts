import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Job } from 'bullmq';

@Exclude()
export class ProjectJobEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  data: any;

  @Expose()
  opts: any;

  @Expose()
  progress: number;

  @Expose()
  attemptsMade: number;

  @Expose()
  finishedOn: number;

  @Expose()
  processedOn: number;

  @Expose()
  failedReason: string;

  @Expose()
  timestamp: number;

  @Expose()
  status: string;

  constructor(partial: Partial<ProjectJobEntity>) {
    Object.assign(this, partial);
  }

  public static async fromBullJob(job: Job): Promise<ProjectJobEntity> {
    const status = await job.getState();
    const plainData = {
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
      status,
    };

    return plainToInstance(ProjectJobEntity, plainData, {
      excludeExtraneousValues: true,
    });
  }

  public static async fromBullJobs(jobs: Job[]): Promise<ProjectJobEntity[]> {
    return Promise.all(jobs.map((job) => this.fromBullJob(job)));
  }
}
