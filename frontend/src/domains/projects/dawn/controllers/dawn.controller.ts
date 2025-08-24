import { api } from 'boot/axios.js';
import type { IBaseJobProfile } from '@crydonkey/shared';

class DawnController {
  async checkAuth(params: { profiles: IBaseJobProfile[] }): Promise<void> {
    await api.post('/projects/dawn/check-auth', params);
  }
}

export default new DawnController();
