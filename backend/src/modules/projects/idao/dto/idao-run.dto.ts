import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import IIdaoForecastOptions from '@src/modules/projects/idao/types/idao-forecast-options.interface.js';
import { RunJobBaseDto } from '@src/modules/projects/dto/run-job.base.dto.js';

export class IdaoRunDTO extends RunJobBaseDto {
  @IsNumber()
  @IsNotEmpty()
  minTargetPriceDeviation: number;

  @IsNumber()
  @IsNotEmpty()
  maxTargetPriceDeviation: number;

  @ValidateNested()
  forecastOptions: IIdaoForecastOptions;
}
