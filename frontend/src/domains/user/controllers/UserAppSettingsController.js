import { api } from 'src/boot/axios';

class UserAppSettingsController {
  constructor() {
    this.api = api;
  }

  async get() {
    const response = await this.api.get('/user-app-settings');

    return response.data.data;
  }

  async update(params) {
    const response = await this.api.patch('/user-app-settings', params);

    return response.data.data;
  }
}

export default new UserAppSettingsController();
