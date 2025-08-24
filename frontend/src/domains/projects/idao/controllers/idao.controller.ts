import { api } from 'boot/axios.js';
import type { RIdaoRun } from 'src/domains/projects/idao/requests/idao.run.request.js';

class IdaoController {
  async run(params: RIdaoRun): Promise<void> {
    await api.post('/projects/idao/run', params);
  }

  async retryJob(id: string): Promise<void> {
    await api.post(`/projects/idao/jobs/${id}/retry`);
  }
}

export default new IdaoController();
