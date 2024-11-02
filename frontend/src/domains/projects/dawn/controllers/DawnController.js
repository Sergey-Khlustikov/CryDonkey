import {api} from 'src/boot/axios';

class DawnController {
  constructor() {
    this.api = api;
  }

  async checkAuth(params) {
    const response = await this.api.post('/dawn/checkAuth', params);

    return response.data;
  }
}

export default new DawnController();
