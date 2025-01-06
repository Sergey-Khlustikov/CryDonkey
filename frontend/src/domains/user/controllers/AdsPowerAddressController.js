import { api } from 'src/boot/axios';

class AdsPowerAddressController {
  constructor() {
    this.api = api;
  }

  async getList() {
    const response = await this.api.get('/adsPowerAddress/getList');

    return response.data;
  }

  async create(params) {
    const response = await this.api.post('/adsPowerAddress/create', params);

    return response.data;
  }

  async update(id, params) {
    const response = await this.api.patch(`/adsPowerAddress/update/${id}`, params);

    return response.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/adsPowerAddress/delete/${id}`);

    return response.data;
  }
}

export default new AdsPowerAddressController();
