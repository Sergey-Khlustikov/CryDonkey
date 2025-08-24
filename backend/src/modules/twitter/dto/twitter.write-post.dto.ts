import { RunJobBaseDto } from '@src/modules/projects/dto/run-job.base.dto.js';
import { IsArray, IsIn, IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ETwitterAutomationTypes } from '@crydonkey/shared';

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
