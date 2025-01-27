import { BaseController } from '@src/common/controllers/base.controller.js';
import { ProjectQueuesManagerService } from '@src/modules/projects/services/project-queues-manager.service.js';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ProjectJobEntity } from '@src/modules/projects/entities/project-job.entity.js';
import { RetryJobDto } from '@src/modules/projects/dto/retry-job.dto.js';
import { RemoveJobDto } from '@src/modules/projects/dto/remove-job.dto.js';

@Controller('projects/queues')
export class ProjectQueuesManagerController extends BaseController {
  constructor(
    private readonly projectQueuesManagerService: ProjectQueuesManagerService,
  ) {
    super();
  }

  @Get('/jobs')
  async getList() {
    const jobs = await this.projectQueuesManagerService.getList();
    return this.createResponse(await ProjectJobEntity.fromBullJobs(jobs));
  }

  @Post('/jobs/retry')
  async retryJob(@Body() dto: RetryJobDto) {
    await this.projectQueuesManagerService.retryJobByIdAndQueueName(dto);
    return this.createEmptyResponse();
  }

  @Delete('/jobs/remove')
  async removeJob(@Query() dto: RemoveJobDto) {
    await this.projectQueuesManagerService.removeJobByIdAndQueueName(dto);
    return this.createEmptyResponse();
  }

  @Post('/jobs/retry-failed')
  async retryFailed() {
    await this.projectQueuesManagerService.retryFailed();
    return this.createEmptyResponse();
  }

  @Delete('/jobs/delete-all')
  async deleteAll() {
    await this.projectQueuesManagerService.deleteAll();
    return this.createEmptyResponse();
  }
}
