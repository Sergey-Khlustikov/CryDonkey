import axios from 'axios';

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}`,
    });
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
