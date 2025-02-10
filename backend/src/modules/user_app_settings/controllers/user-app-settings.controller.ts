import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserAppSettingsService } from '@src/modules/user_app_settings/services/user-app-settings.service.js';
import { UpdateUserAppSettingsDto } from '@src/modules/user_app_settings/dto/update-user-app-settings.dto.js';
import { BaseController } from '@src/common/controllers/base.controller.js';
import { BaseEntity } from '@src/common/entities/base.entity.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('user-app-settings')
export class UserAppSettingsController extends BaseController {
  constructor(private readonly userAppSettingsService: UserAppSettingsService) {
    super();
  }

  @Get()
  async getUserAppSettings(@AuthUser() authUser: IAuthUser) {
    const settings = await this.userAppSettingsService.getByUserId(
      authUser._id,
    );

    return this.createResponse(BaseEntity.fromObject(settings));
  }

  @Patch()
  async updateUserAppSettings(
    @AuthUser() authUser: IAuthUser,
    @Body() updateDto: UpdateUserAppSettingsDto,
  ) {
    const settings = await this.userAppSettingsService.updateByUserId(
      authUser._id,
      updateDto,
    );

    return this.createResponse(BaseEntity.fromObject(settings));
  }

  @Get('active-ads-power-address')
  async getActiveAdsPowerAddress(@AuthUser() authUser: IAuthUser) {
    const settings = this.userAppSettingsService.getActiveAdsPowerAddress(
      authUser._id,
    );

    return this.createResponse(BaseEntity.fromObject(settings));
  }
}
