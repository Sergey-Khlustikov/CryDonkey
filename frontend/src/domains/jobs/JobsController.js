import { api } from 'src/boot/axios';

class JobsController {
  constructor() {
    this.api = api;
  }

  async getList(params) {
    const response = await this.api.get('/projects/queues/jobs', params);

    return response.data.data;
  }

  async retry(jobId, queueName) {
    return this.api.post('/projects/queues/jobs/retry', { id: jobId, queueName });
  }

  async remove(jobId, queueName) {
    return this.api.delete('/projects/queues/jobs/remove', { params: { queueName, id: jobId } });
  }

  async deleteAll() {
    return this.api.delete('/projects/queues/jobs/delete-all');
  }

  async retryFailed() {
    return this.api.post('/projects/queues/jobs/retry-failed');
  }
}

export default new JobsController();
