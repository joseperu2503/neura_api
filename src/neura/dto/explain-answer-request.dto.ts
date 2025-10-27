import { IsArray, IsInt, IsString } from 'class-validator';

export class ExplainAnswerRequestDto {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsInt()
  correct: number;

  @IsInt()
  answer: number;
}
