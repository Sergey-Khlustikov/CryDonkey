import axios from 'axios';

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: `http://localhost:${process.env.VUE_APP_SERVER_PORT}`,
    });
  }

  async status() {
    return this.api.get('/status');
  }

  async runRcade(profiles) {
    try {
      await this.api.post('/rcade/run', { profiles });
    } catch (e) {
      console.error(e);
    }
  }

  async runSwan({ profiles, dailyFirst, dailySecond, dailyThird, onlyDaily }) {
    try {
      await this.api.post('/swan/run', {
        profiles, dailyFirst, dailySecond, dailyThird, onlyDaily,
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export default new Api();
