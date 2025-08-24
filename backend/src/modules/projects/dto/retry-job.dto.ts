import { IsNotEmpty } from 'class-validator';
import { EQueueNames } from '@crydonkey/shared';

export class RetryJobDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  queueName: EQueueNames;
}
