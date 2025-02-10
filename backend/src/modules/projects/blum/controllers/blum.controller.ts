import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '@src/common/controllers/base.controller.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import { BlumService } from '@src/modules/projects/blum/services/blum.service.js';
import { BlumRunDto } from '@src/modules/projects/blum/dto/blum-run.dto.js';

@Controller('projects/blum/')
@UseInterceptors(ClassSerializerInterceptor)
export class BlumController extends BaseController {
  constructor(private blumQueueService: BlumService) {
    super();
  }

  @Post('run')
  async run(@Body() dto: BlumRunDto, @AuthUser() authUser: IAuthUser) {
    await this.blumQueueService.addJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }
}
