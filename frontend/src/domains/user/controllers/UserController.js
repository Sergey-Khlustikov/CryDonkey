import { api } from 'src/boot/axios';

class UserController {
  constructor() {
    this.api = api;
  }

  async getList() {
    const response = await this.api.get('/users/');

    return response.data.data;
  }

  async me() {
    const response = await this.api.get('/users/me');

    return response.data.data;
  }

  async create(params) {
    const response = await this.api.post('/users/', params);

    return response.data.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/users/${id}`);

    return response.data.data;
  }
}

export default new UserController();
