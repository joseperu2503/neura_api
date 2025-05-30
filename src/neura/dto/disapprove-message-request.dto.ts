import { IsNotEmpty, IsString } from 'class-validator';

export class DisapproveMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
