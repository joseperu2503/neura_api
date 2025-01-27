import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CompletionDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
