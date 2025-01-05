import UserAppSettings, {IUserAppSettings} from "#src/domains/user_app_settings/models/UserAppSettings.js";
import {getAuthUser} from "#src/middlewares/authMiddleware.js";
import {IAdsPowerAddress} from "#src/domains/ads/models/AdsPowerAddress.js";

class UserAppSettingsRepository {
  async getByUserId(userId: string) {
    return UserAppSettings.findOne({userId});
  }

  async updateByUserId(userId: string, data: IUserAppSettings): Promise<IUserAppSettings> {
    const model = await UserAppSettings.findOne({userId})

    if (!model) {
      throw new Error('Model not found');
    }

    if (data.activeAdsPowerAddress) {
      model.activeAdsPowerAddress = data.activeAdsPowerAddress;
    }

    if (data.language) {
      model.language = data.language;
    }

    return model.save();
  }

  async getActiveAdsPowerAddress(userId: string = getAuthUser().id): Promise<IAdsPowerAddress> {
    const userSettings = await UserAppSettings
      .findOne({userId})
      .populate<{ activeAdsPowerAddress: IAdsPowerAddress }>('activeAdsPowerAddress');

    if (!userSettings) {
      throw new Error('UserSettings not found');
    }

    return userSettings.activeAdsPowerAddress;
  }
}

export default UserAppSettingsRepository;
