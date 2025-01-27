import { api } from 'src/boot/axios';

class AdsPowerAddressController {
  constructor() {
    this.api = api;
  }

  async getList() {
    const response = await this.api.get('/ads-power-address');

    return response.data.data;
  }

  async create(params) {
    const response = await this.api.post('/ads-power-address', params);

    return response.data.data;
  }

  async update(id, params) {
    const response = await this.api.patch(`/ads-power-address/${id}`, params);

    return response.data.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/ads-power-address/${id}`);

    return response.data.data;
  }
}

export default new AdsPowerAddressController();
