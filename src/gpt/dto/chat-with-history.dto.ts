import { IsString } from 'class-validator';

export class ChatWithHistoryDto {
  @IsString()
  readonly prompt: string;
}
