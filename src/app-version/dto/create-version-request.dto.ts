import { IsEnum, IsString } from 'class-validator';
import { PlatformEnum } from '../enums/platform.enum';

export class CreateVersionRequestDto {
  @IsString()
  @IsEnum(PlatformEnum)
  platform: PlatformEnum;

  @IsString()
  version: string;
}
