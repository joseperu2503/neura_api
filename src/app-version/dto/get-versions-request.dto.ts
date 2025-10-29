import { IsEnum, IsString } from 'class-validator';
import { PlatformEnum } from '../enums/platform.enum';

export class GetVersionsRequestDto {
  @IsString()
  @IsEnum(PlatformEnum)
  platform: PlatformEnum;
}
