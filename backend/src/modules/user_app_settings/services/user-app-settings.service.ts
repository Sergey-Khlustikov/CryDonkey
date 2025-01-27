import { Injectable, NotFoundException } from '@nestjs/common';
import UserAppSettingsRepository from '@src/modules/user_app_settings/repositories/user-app-settings.repository.js';
import { Types } from 'mongoose';
import { UpdateUserAppSettingsDto } from '@src/modules/user_app_settings/dto/update-user-app-settings.dto.js';

@Injectable()
export class UserAppSettingsService {
  constructor(
    private readonly userAppSettingsRepository: UserAppSettingsRepository,
  ) {}

  async getByUserId(userId: string) {
    const settings = await this.userAppSettingsRepository.getByUserId(
      new Types.ObjectId(userId),
    );

    if (!settings) {
      throw new NotFoundException();
    }

    return settings;
  }

  async updateByUserId(userId: string, updateDto: UpdateUserAppSettingsDto) {
    const user = await this.userAppSettingsRepository.updateByUserId(
      new Types.ObjectId(userId),
      updateDto,
    );

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getActiveAdsPowerAddress(userId: string) {
    const address =
      await this.userAppSettingsRepository.getActiveAdsPowerAddress(
        new Types.ObjectId(userId),
      );

    if (!address) {
      throw new NotFoundException();
    }

    return address;
  }
}
