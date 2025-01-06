import { api } from 'src/boot/axios';

class UserAppSettingsController {
  constructor() {
    this.api = api;
  }

  async get() {
    const response = await this.api.get('/userAppSetting');

    return response.data;
  }

  async update(params) {
    const response = await this.api.patch('/userAppSetting/update', params);

    return response.data;
  }
}

export default new UserAppSettingsController();
