import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { AdsPowerApiService } from '@src/modules/ads-power/services/ads-power-api.service.js';
import { BaseController } from '@src/common/controllers/base.controller.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('ads-power')
export class AdsPowerApiController extends BaseController {
  constructor(private readonly adsPowerApiService: AdsPowerApiService) {
    super();
  }

  @Get('profiles')
  async getProfiles(@Request() req: any, @Query('page_size') pageSize = 1000) {
    const profiles = await this.adsPowerApiService.getProfiles(
      req.authUser._id,
      {
        page_size: pageSize,
      },
    );

    return this.createResponse(profiles);
  }

  @Get('groups')
  async getGroups(@Request() req: any, @Query('page_size') pageSize = 50) {
    const groups = await this.adsPowerApiService.getGroups(req.authUser._id, {
      page_size: pageSize,
    });

    return this.createResponse(groups);
  }

  @Get('open-profile/:profileId')
  async openProfile(
    @AuthUser() authUser: IAuthUser,
    @Param('profileId') profileId: string,
  ) {
    const profile = this.adsPowerApiService.openProfile(
      profileId,
      authUser._id,
    );

    this.createResponse(profile);
  }
}
