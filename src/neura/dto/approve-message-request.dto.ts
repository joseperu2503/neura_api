import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;
}
