// @ts-nocheck
class JobResource {
  constructor(jobs) {
    this.jobs = jobs;
  }

  async getFormatted() {
    return await Promise.all(this.jobs.map(async job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      failedReason: job.failedReason,
      status: await job.getState(),
      timestamp: job.timestamp,
    })));
  }
}

export default JobResource;
