import { BaseController } from '@src/common/controllers/base.controller.js';
import { IdaoQueueService } from '@src/modules/projects/idao/services/idao-queue.service.js';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { IdaoRunDTO } from '@src/modules/projects/idao/dto/idao-run.dto.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('projects/idao/')
@UseInterceptors(ClassSerializerInterceptor)
export class IdaoController extends BaseController {
  constructor(private idaoQueueService: IdaoQueueService) {
    super();
  }

  @Post('run')
  async run(@Body() dto: IdaoRunDTO, @AuthUser() authUser: IAuthUser) {
    await this.idaoQueueService.addJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }

  @Post('jobs/:id/retry')
  async retryJob(@Param('id') id: string) {
    await this.idaoQueueService.retryJob(id);
    return this.createEmptyResponse();
  }
}
