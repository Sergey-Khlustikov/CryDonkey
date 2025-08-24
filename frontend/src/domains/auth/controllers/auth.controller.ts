import { api } from 'boot/axios.js';

class AuthController {
  async login(username: string, password: string) {
    const response = await api.post('/auth/login', { username, password });

    return response.data;
  }

  async logout() {
    const response = await api.post('/auth/logout');

    return response.data;
  }
}

export default new AuthController();
