import axios, {AxiosInstance} from 'axios';
import puppeteer from 'puppeteer';
import {getAuthUser} from "#src/middlewares/authMiddleware.js";
import UserAppSettingsRepository from "#src/domains/user_app_settings/repositories/UserAppSettingsRepository.js";

class AdsPowerService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create();
  }

  private async getAdsPowerApiUrl(userId: string = getAuthUser().id) {
    const adsPowerAddress = await new UserAppSettingsRepository().getActiveAdsPowerAddress(userId);
    return `http://${adsPowerAddress.host}:${adsPowerAddress.port}/api/v1`;
  }

  async getProfiles(params = {page_size: 1000}) {
    const response = await this.api.get(`${await this.getAdsPowerApiUrl()}/user/list`, {params});

    return response.data;
  }

  async getGroups(params = {page_size: 50}) {
    const response = await this.api.get(`${await this.getAdsPowerApiUrl()}/group/list`, {params});

    return response.data;
  }

  async openProfile(profileId: string | number, userId?: string) {
    const response = await this.api.get(`${await this.getAdsPowerApiUrl(userId)}/browser/start`, {
      params: {
        user_id: profileId,
      }
    });

    return response.data;
  }

  async connectToPuppeteer(profileId: string | number, userId?: string) {
    const response = await this.openProfile(profileId, userId);

    if (response.code === 0 && response.data.ws && response.data.ws.puppeteer) {
      try {
        const userAdsPowerUrl = new URL(await this.getAdsPowerApiUrl(userId));
        const puppeteerWsUrl = new URL(response.data.ws.puppeteer);
        const originalPort = puppeteerWsUrl.port;

        puppeteerWsUrl.hostname = userAdsPowerUrl.hostname;
        puppeteerWsUrl.port = '5050';

        return await puppeteer.connect({
          browserWSEndpoint: puppeteerWsUrl.toString(),
          defaultViewport: null,
          headers: {
            'X-Forwarded-Port': originalPort
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error('Failed to retrieve puppeteer WebSocket URL from API');
    }
  }
}

export default new AdsPowerService();
