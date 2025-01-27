import { IsArray, IsString } from 'class-validator';
import { ChatCompletionMessageParam } from 'openai/resources';

export class ChatWithHistoryDto {
  @IsArray()
  readonly messages: ChatCompletionMessageParam[] = [];
}
