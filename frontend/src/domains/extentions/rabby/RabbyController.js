import { api } from 'src/boot/axios';

class RabbyController {
  constructor() {
    this.api = api;
  }

  async unlock(params) {
    const response = await this.api.post('/rabby/jobs/unlock', params);

    return response.data;
  }

  async retryJob(id) {
    const response = await this.api.post(`/rabby/jobs/${id}/retry`);

    return response.data;
  }
}

export default new RabbyController();
