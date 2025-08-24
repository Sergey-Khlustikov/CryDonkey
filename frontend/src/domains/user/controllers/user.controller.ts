import { api } from 'boot/axios.js';
import type { IUser } from 'src/domains/user/structures/user.interface.js';
import type { RUserCreate } from 'src/domains/user/requests/user-create.request.js';

class UserController {
  async getList(): Promise<IUser[]> {
    const response = await api.get('/users/');

    return response.data.data;
  }

  async me(): Promise<IUser> {
    const response = await api.get('/users/me');

    return response.data.data;
  }

  async create(params: RUserCreate): Promise<IUser> {
    const response = await api.post('/users/', params);

    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export default new UserController();
