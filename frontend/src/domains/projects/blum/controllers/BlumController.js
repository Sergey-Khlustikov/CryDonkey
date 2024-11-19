import { api } from 'src/boot/axios';

class BlumController {
  constructor() {
    this.api = api;
  }

  async run(params) {
    const response = await this.api.post('/blum/run', params);

    return response.data;
  }
}

export default new BlumController();
