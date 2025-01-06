import { api } from 'src/boot/axios';

class AuthController {
  constructor() {
    this.api = api;
  }

  async login(username, password) {
    const response = await this.api.post('/auth/login', { username, password });

    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');

    return response.data;
  }
}

export default new AuthController();
