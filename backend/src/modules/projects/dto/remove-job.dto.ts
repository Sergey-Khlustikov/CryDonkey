import { IsNotEmpty } from 'class-validator';
import { EQueueNames } from '@crydonkey/shared';

export class RemoveJobDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  queueName: EQueueNames;
}
