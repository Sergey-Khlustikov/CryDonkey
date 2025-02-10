import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserAppSettings,
  UserAppSettingsDocument,
} from '@src/modules/user_app_settings/schemas/user-app-settings.schema.js';
import { UpdateUserAppSettingsDto } from '@src/modules/user_app_settings/dto/update-user-app-settings.dto.js';
import { AdsPowerAddress } from '@src/modules/ads-power/schemas/ads-power-address.schema.js';

@Injectable()
export class UserAppSettingsRepository {
  constructor(
    @InjectModel(UserAppSettings.name)
    private readonly userAppSettingsModel: Model<UserAppSettings>,
  ) {}

  async getByUserId(
    userId: Types.ObjectId,
  ): Promise<UserAppSettingsDocument | null> {
    return this.userAppSettingsModel.findOne({ userId }).exec();
  }

  async updateByUserId(
    userId: Types.ObjectId,
    updateDto: UpdateUserAppSettingsDto,
  ): Promise<UserAppSettingsDocument | null> {
    const doc = await this.userAppSettingsModel.findOne({ userId }).exec();

    if (!doc) {
      return null;
    }

    if (updateDto.activeAdsPowerAddress !== undefined) {
      doc.activeAdsPowerAddress = new Types.ObjectId(
        updateDto.activeAdsPowerAddress,
      );
    }

    if (updateDto.language !== undefined) {
      doc.language = updateDto.language;
    }

    await doc.save();

    return doc;
  }

  async getActiveAdsPowerAddress(userId: Types.ObjectId) {
    const settings = await this.userAppSettingsModel
      .findOne({ userId })
      .populate<{
        activeAdsPowerAddress: AdsPowerAddress;
      }>('activeAdsPowerAddress')
      .exec();

    if (!settings) {
      return null;
    }

    return settings.activeAdsPowerAddress;
  }
}

export default UserAppSettingsRepository;
