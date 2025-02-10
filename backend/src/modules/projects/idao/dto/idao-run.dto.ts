import { IsNotEmpty, IsNumber } from 'class-validator';
import { RunJobBaseDto } from '@src/modules/projects/dto/run-job.base.dto.js';

export class IdaoRunDTO extends RunJobBaseDto {
  @IsNumber()
  @IsNotEmpty()
  minTargetPriceDeviation: number;

  @IsNumber()
  @IsNotEmpty()
  maxTargetPriceDeviation: number;
}
