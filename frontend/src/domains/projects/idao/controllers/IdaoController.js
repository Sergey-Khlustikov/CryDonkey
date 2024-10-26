import { api } from 'src/boot/axios';

class IdaoController {
  constructor() {
    this.api = api;
  }

  async run(params) {
    const response = await this.api.post('/idao/run', params);

    return response.data;
  }
}

export default new IdaoController();
