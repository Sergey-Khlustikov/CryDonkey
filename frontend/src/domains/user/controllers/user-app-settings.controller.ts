import { api } from 'boot/axios.js';
import type { RUserAppSettingsUpdate } from 'src/domains/user/requests/user-app-settings.update.request.js';
import type { IUserAppSettings } from 'src/domains/user/structures/user-app-settings.interface.js';

class UserAppSettingsController {
  async get(): Promise<IUserAppSettings> {
    const response = await api.get('/user-app-settings');

    return response.data.data;
  }

  async update(params: RUserAppSettingsUpdate): Promise<IUserAppSettings> {
    const response = await api.patch('/user-app-settings', params);

    return response.data.data;
  }
}

export default new UserAppSettingsController();
