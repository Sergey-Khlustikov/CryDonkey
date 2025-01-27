import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateMessageDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
