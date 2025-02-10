import { IsNotEmpty } from 'class-validator';
import EQueueNames from '@src/common/queues/enums/EQueueNames.js';

export class RemoveJobDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  queueName: EQueueNames;
}
