import { api } from 'boot/axios.js';
import type { EQueueNames } from '@crydonkey/shared';
import type { IProjectJob } from 'src/domains/jobs/structures/project-job.interface.js';

class JobsController {
  async getList(): Promise<IProjectJob[]> {
    const response = await api.get('/projects/queues/jobs');
    return response.data.data;
  }

  async retry(jobId: string, queueName: EQueueNames): Promise<void> {
    await api.post('/projects/queues/jobs/retry', { id: jobId, queueName });
  }

  async remove(jobId: string, queueName: EQueueNames): Promise<void> {
    await api.delete('/projects/queues/jobs/remove', { params: { queueName, id: jobId } });
  }

  async deleteAll(): Promise<void> {
    await api.delete('/projects/queues/jobs/delete-all');
  }

  async retryFailed(): Promise<void> {
    await api.post('/projects/queues/jobs/retry-failed');
  }
}

export default new JobsController();
