import { BaseController } from '@src/common/controllers/base.controller.js';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';
import { RabbyUnlockDto } from '@src/modules/extensions/rabby/dto/rabby-unlock.dto.js';
import { RabbyQueueService } from '@src/modules/extensions/rabby/services/rabby-queue.service.js';

@Controller('rabby/')
@UseInterceptors(ClassSerializerInterceptor)
export class RabbyController extends BaseController {
  constructor(private rabbyJobService: RabbyQueueService) {
    super();
  }

  @Post('jobs/unlock')
  async unlock(@Body() dto: RabbyUnlockDto, @AuthUser() authUser: IAuthUser) {
    await this.rabbyJobService.addUnlockJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }

  @Post('jobs/:id/retry')
  async retryJob(@Param('id') id: string) {
    await this.rabbyJobService.retryJob(id);
    return this.createEmptyResponse();
  }
}
