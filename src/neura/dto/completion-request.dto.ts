import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CompletionRequestDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
