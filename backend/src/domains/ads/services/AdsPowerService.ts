import axios, {AxiosInstance} from 'axios';
import ENV from "#src/structures/env.js";
import puppeteer from 'puppeteer';

class AdsPowerService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: ENV.ADS_API_URL,
    });
  }

  async getProfiles(params = {page_size: 1000}) {
    const response = await this.api.get('/user/list', {params});

    return response.data;
  }

  async getGroups(params = {page_size: 50}) {
    const response = await this.api.get('/group/list', {params});

    return response.data;
  }

  async openProfile(profileId: string | number) {
    const response = await this.api.get('/browser/start', {
      params: {
        user_id: profileId,
      }
    });

    return response.data;
  }

  async connectToPuppeteer(profileId: string | number) {
    const response = await this.openProfile(profileId);

    if (response.code === 0 && response.data.ws && response.data.ws.puppeteer) {
      try {
        const puppeteerWsUrl = new URL(response.data.ws.puppeteer);
        const originalPort = puppeteerWsUrl.port;

        puppeteerWsUrl.hostname = ENV.ADS_HOST;
        puppeteerWsUrl.port = '5050';

        return await puppeteer.connect({
          browserWSEndpoint: puppeteerWsUrl.toString(),
          defaultViewport: null,
          headers: {
            'X-Forwarded-Port': originalPort
          }
        });
      } catch (e) {
        console.log(e)
      }
    } else {
      throw new Error('Failed to retrieve puppeteer WebSocket URL from API');
    }
  }
}

export default new AdsPowerService();
