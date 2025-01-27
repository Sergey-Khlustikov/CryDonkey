import { api } from 'src/boot/axios';

class IdaoController {
  constructor() {
    this.api = api;
  }

  async run(params) {
    const response = await this.api.post('/projects/idao/run', params);

    return response.data;
  }

  async retryJob(id) {
    const response = await this.api.post(`/projects/idao/jobs/${id}/retry`);

    return response.data;
  }
}

export default new IdaoController();
