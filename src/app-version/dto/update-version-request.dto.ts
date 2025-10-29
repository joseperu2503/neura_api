import { IsBoolean, IsMongoId } from 'class-validator';

export class UpdateVersionRequestDto {
  @IsMongoId()
  id: string;

  @IsBoolean()
  isActive: boolean;
}
