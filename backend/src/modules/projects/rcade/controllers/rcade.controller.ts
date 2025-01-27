import { BaseController } from '@src/common/controllers/base.controller.js';
import { RcadeQueueService } from '@src/modules/projects/rcade/services/rcade-queue.service.js';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RcadeRunDto } from '@src/modules/projects/rcade/dto/rcade-run.dto.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('projects/rcade/')
@UseInterceptors(ClassSerializerInterceptor)
export class RcadeController extends BaseController {
  constructor(private rcadeQueueService: RcadeQueueService) {
    super();
  }

  @Post('run')
  async run(@Body() dto: RcadeRunDto, @AuthUser() authUser: IAuthUser) {
    await this.rcadeQueueService.addJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }
}
