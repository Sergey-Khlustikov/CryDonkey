import UserAppSettingsRepository from "#src/domains/user_app_settings/repositories/UserAppSettingsRepository.js";
import {Request, Response} from "express";

class UserAppSettingsController {
  private userAppSettingsRepository = new UserAppSettingsRepository();

  async get(request: Request, response: Response) {
    try {
      const settings = await this.userAppSettingsRepository.getByUserId(request.authUser.id);

      response.status(200).json(settings);
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async update(request: Request, response: Response) {
    try {
      await this.userAppSettingsRepository.updateByUserId(request.authUser.id, request.body);

      response.status(200).json({message: 'Info updated successfully'});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }
}

export default UserAppSettingsController;
