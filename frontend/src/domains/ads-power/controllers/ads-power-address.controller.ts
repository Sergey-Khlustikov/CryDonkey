import { api } from 'boot/axios.js';
import type { IAdsPowerAddress } from 'src/domains/ads-power/structures/ads-power-address.interface.js';
import type { AdsPowerAddressCreateDto } from 'src/domains/ads-power/dto/ads-power-addres-create.dto.js';
import type { AdsPowerAddressUpdateDto } from 'src/domains/ads-power/dto/ads-power-addres-update.dto.js';

class AdsPowerAddressController {
  async getList(): Promise<IAdsPowerAddress[]> {
    const response = await api.get('/ads-power-address');

    return response.data.data;
  }

  async create(params: AdsPowerAddressCreateDto): Promise<IAdsPowerAddress> {
    const response = await api.post('/ads-power-address', params);

    return response.data.data;
  }

  async update(id: string, params: AdsPowerAddressUpdateDto): Promise<IAdsPowerAddress> {
    const response = await api.patch(`/ads-power-address/${id}`, params);

    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/ads-power-address/${id}`);
  }
}

export default new AdsPowerAddressController();
