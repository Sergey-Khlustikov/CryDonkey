import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserAppSettingsService } from '@src/modules/user_app_settings/services/user-app-settings.service.js';
import { AxiosError } from 'axios';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class AdsPowerApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userAppSettingsService: UserAppSettingsService,
  ) {}

  private async getAdsPowerApiUrl(userId: string): Promise<string> {
    const address =
      await this.userAppSettingsService.getActiveAdsPowerAddress(userId);

    if (!address) {
      throw new NotFoundException('No AdsPowerAddress found');
    }

    return `http://${address.host}:${address.port}/api/v1`;
  }

  async getProfiles(userId: string, params = { page_size: 1000 }) {
    try {
      const apiUrl = await this.getAdsPowerApiUrl(userId);

      const response = await this.httpService.axiosRef.get(
        `${apiUrl}/user/list`,
        { params },
      );

      return response.data.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to get profiles from AdsPower API');
    }
  }

  async getGroups(userId: string, params = { page_size: 50 }) {
    try {
      const apiUrl = await this.getAdsPowerApiUrl(userId);
      const response = await this.httpService.axiosRef.get(
        `${apiUrl}/group/list`,
        { params },
      );

      return response.data.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to get groups from AdsPower API');
    }
  }

  async openProfile(profileId: string | number, userId: string) {
    try {
      const apiUrl = await this.getAdsPowerApiUrl(userId);
      const response = await this.httpService.axiosRef.get(
        `${apiUrl}/browser/start`,
        { params: { user_id: profileId } },
      );

      return response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to open profile in AdsPower');
    }
  }

  async connectToPuppeteer(
    profileId: string | number,
    userId: string,
  ): Promise<Browser> {
    const openProfileResponse = await this.openProfile(profileId, userId);

    if (
      openProfileResponse?.code === 0 &&
      openProfileResponse?.data?.ws?.puppeteer
    ) {
      try {
        const userAdsPowerUrl = new URL(await this.getAdsPowerApiUrl(userId));
        const puppeteerWsUrl = new URL(openProfileResponse.data.ws.puppeteer);
        const originalPort = puppeteerWsUrl.port;

        puppeteerWsUrl.hostname = userAdsPowerUrl.hostname;
        puppeteerWsUrl.port = '5050';

        return await puppeteer.connect({
          browserWSEndpoint: puppeteerWsUrl.toString(),
          defaultViewport: null,
          headers: {
            'X-Forwarded-Port': originalPort,
          },
        });
      } catch (e) {
        throw new InternalServerErrorException(
          `Failed to connect puppeteer: ${e.message}`,
        );
      }
    } else {
      throw new InternalServerErrorException(
        'Failed to retrieve puppeteer WebSocket URL from AdsPower API',
      );
    }
  }

  private handleAxiosError(error: any, contextMessage: string): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;

      throw new InternalServerErrorException(
        `${contextMessage}: ${error.message}; status=${status}; data=${JSON.stringify(data)}`,
      );
    } else {
      throw new InternalServerErrorException(
        `${contextMessage}: ${error?.message || error}`,
      );
    }
  }
}
