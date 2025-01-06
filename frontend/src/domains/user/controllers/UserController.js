import { api } from 'src/boot/axios';

class UserController {
  constructor() {
    this.api = api;
  }

  async getList() {
    const response = await this.api.get('/user/getList');

    return response.data;
  }

  async me() {
    const response = await this.api.get('/user/me');

    return response.data;
  }

  async create(params) {
    const response = await this.api.post('/user/create', params);

    return response.data;
  }

  async delete(id) {
    const response = await this.api.delete('/user/delete', { data: { id } });

    return response.data;
  }
}

export default new UserController();
