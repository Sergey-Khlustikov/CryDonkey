import { api } from 'boot/axios.js';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import type { IAdsPowerGroup } from 'src/domains/ads-power/structures/ads-power-group.interface.js';

class AdsPowerController {
  async openAdsProfile(profileId: string) {
    return await api.get(`/ads-power/open-profile/${profileId}`);
  }

  async getProfiles(params = { page_size: 1000 }): Promise<IAdsPowerProfile[]> {
    const response = await api.get('/ads-power/profiles', { params });

    return response.data.data.list;
  }

  async getGroups(params = { page_size: 50 }): Promise<IAdsPowerGroup[]> {
    const response = await api.get('/ads-power/groups', { params });

    return response.data.data.list;
  }
}

export default new AdsPowerController();
