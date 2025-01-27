import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import IBaseJobProfile from '@src/modules/projects/types/IBaseJobProfile.js';

export class RunJobBaseDto {
  @IsArray()
  @IsNotEmpty()
  profiles: IBaseJobProfile[];

  @IsNumber()
  minDelayMinutes: number;

  @IsNumber()
  maxDelayMinutes: number;

  @IsArray()
  @IsString({ each: true })
  keepOpenProfileIds: string[];
}
