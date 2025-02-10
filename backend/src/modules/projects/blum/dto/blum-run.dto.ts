import { RunJobBaseDto } from '@src/modules/projects/dto/run-job.base.dto.js';
import { IsNotEmpty } from 'class-validator';

export interface IBlumOptions {
  playGame: boolean;
}

export class BlumRunDto extends RunJobBaseDto {
  @IsNotEmpty()
  options: IBlumOptions;
}
