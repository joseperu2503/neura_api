import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MessageFeedbackRequestDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  feedbackDescription: string;

  @IsString()
  @IsOptional()
  @IsIn(['GOOD', 'BAD'])
  feedbackType: 'GOOD' | 'BAD' | null;
}
