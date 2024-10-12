import axios from 'axios';
import ENV from '../structures/env';
import puppeteer from 'puppeteer';

class AdsApi {
  constructor() {
    this.api = axios.create({
      baseURL: ENV.ADS_API_URL,
    });
  }

  async getProfiles(params = {
    page_size: 1000,
  }) {
    try {
      const response = await this.api.get('/user/list', { params });

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getGroups(params = { page_size: 50 }) {
    try {
      const response = await this.api.get('/group/list', { params });

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async openProfile(profileId) {
    try {
      const response = await this.api.get('/browser/start', { params: { user_id: profileId } });

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async connectToPuppeteer(profileId) {
    try {
      const response = await this.openProfile(profileId);

      if (response.code === 0 && response.data.ws && response.data.ws.puppeteer) {
        const puppeteerWsUrl = response.data.ws.puppeteer.replace('127.0.0.1', ENV.ADS_HOST);
        return await puppeteer.connect({
          browserWSEndpoint: puppeteerWsUrl,
          defaultViewport: null,
        });
      } else {
        throw new Error('Failed to retrieve puppeteer WebSocket URL from API');
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new AdsApi();
