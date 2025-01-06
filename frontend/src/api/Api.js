import { api } from 'src/boot/axios';

/**
 * @deprecated Refactor to dedicated controllers
 */
class Api {
  constructor() {
    this.api = api;
  }

  async status() {
    return this.api.get('/status');
  }

  async runRcade(params) {
    try {
      await this.api.post('/rcade/run', params);
    } catch (e) {
      console.error(e);
    }
  }

  async runSwan(params) {
    try {
      await this.api.post('/swan/run', params);
    } catch (e) {
      console.error(e);
    }
  }
}

export default new Api();
