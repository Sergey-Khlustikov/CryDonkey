import { IsNotEmpty } from 'class-validator';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';

export class RetryJobDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  queueName: EQueueNames;
}
