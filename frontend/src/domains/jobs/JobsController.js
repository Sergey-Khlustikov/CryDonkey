import { api } from 'src/boot/axios';

class JobsController {
  constructor() {
    this.api = api;
  }

  async getList(params) {
    const response = await this.api.get('/jobs', params);

    return response.data;
  }

  async retry(jobId, queueName) {
    return this.api.post(`/jobs/${jobId}/retry`, { queueName });
  }

  async remove(jobId, queueName) {
    return this.api.delete(`/jobs/${jobId}/remove`, { params: { queueName } });
  }

  async deleteAll() {
    return this.api.delete('/jobs/deleteAll');
  }

  async retryFailed() {
    return this.api.post('/jobs/retryFailed');
  }

  // Temp
  async runCustom(params) {
    return this.api.post('/jobs/runCustom', params);
  }
}

export default new JobsController();
