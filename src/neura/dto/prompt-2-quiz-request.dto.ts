import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class Prompt2QuizRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  prompt: string;
}
