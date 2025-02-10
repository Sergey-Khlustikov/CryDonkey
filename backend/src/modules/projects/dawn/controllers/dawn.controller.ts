import { BaseController } from '@src/common/controllers/base.controller.js';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DawnService } from '@src/modules/projects/dawn/services/dawn.service.js';
import { DawnCheckAuthDto } from '@src/modules/projects/dawn/dto/dawn-check-auth.dto.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';

@Controller('/projects/dawn/')
@UseInterceptors(ClassSerializerInterceptor)
export class DawnController extends BaseController {
  constructor(private dawnService: DawnService) {
    super();
  }

  @Post('check-auth')
  async checkAuth(
    @Body() dto: DawnCheckAuthDto,
    @AuthUser() authUser: IAuthUser,
  ) {
    await this.dawnService.addCheckAuthJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }
}
