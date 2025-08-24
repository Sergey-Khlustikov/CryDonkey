import { api } from 'boot/axios.js';

class RabbyController {
  async unlock(params: { profiles: { id: string; name: string }[] }): Promise<void> {
    await api.post('/rabby/jobs/unlock', params);
  }

  async retryJob(id: string): Promise<void> {
    await api.post(`/rabby/jobs/${id}/retry`);
  }
}

export default new RabbyController();
