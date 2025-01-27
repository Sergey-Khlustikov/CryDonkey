import { api } from 'src/boot/axios';

class AdsController {
  constructor() {
    this.api = api;
  }

  async openAdsProfile(profileId) {
    return this.api.get(`/ads-power/open-profile/${profileId}`);
  }

  async getProfiles(params = { page_size: 1000 }) {
    const response = await this.api.get('/ads-power/profiles', { params });

    return response.data.data.list;
  }

  async getGroups(params = { page_size: 50 }) {
    const response = await this.api.get('/ads-power/groups', { params });

    return response.data.data.list;
  }
}

export default new AdsController();
