import { IsNotEmpty, IsString } from 'class-validator';

export class GetChatRequestDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
