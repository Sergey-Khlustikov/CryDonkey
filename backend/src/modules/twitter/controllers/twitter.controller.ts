import { BaseController } from '@src/common/controllers/base.controller.js';
import { TwitterQueuesService } from '@src/modules/twitter/services/twitter.queues.service.js';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TwitterWritePostDTO } from '@src/modules/twitter/dto/twitter.write-post.dto.js';
import { AuthUser } from '@src/modules/user/decorators/auth-user.decorator.js';
import { IAuthUser } from '@src/modules/user/structures/auth-user.interface.js';

@Controller('twitter/')
@UseInterceptors(ClassSerializerInterceptor)
export class TwitterController extends BaseController {
  constructor(protected twitterQueuesService: TwitterQueuesService) {
    super();
  }

  @Post('write-post')
  async writePost(
    @Body() dto: TwitterWritePostDTO,
    @AuthUser() authUser: IAuthUser,
  ) {
    await this.twitterQueuesService.addJobs(dto, authUser);
    return this.createEmptyResponse('Jobs added to queue.');
  }
}
