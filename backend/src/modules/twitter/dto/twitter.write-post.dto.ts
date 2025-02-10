import { RunJobBaseDto } from '@src/modules/projects/dto/run-job.base.dto.js';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ETwitterAutomationTypes } from '@src/modules/twitter/structures/twitter.automation-types.enum.js';
import { Type } from 'class-transformer';

export class TwitterWritePostDTO extends RunJobBaseDto {
  @IsIn([ETwitterAutomationTypes.auto, ETwitterAutomationTypes.manual])
  automationType: ETwitterAutomationTypes;

  @ValidateIf((obj) => obj.automationType === ETwitterAutomationTypes.manual)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TwitterPostDTO)
  posts: TwitterPostDTO[];
}

export class TwitterPostDTO {
  @IsString()
  @IsNotEmpty()
  post: string;

  @IsString()
  @IsNotEmpty()
  profileId: string;
}
