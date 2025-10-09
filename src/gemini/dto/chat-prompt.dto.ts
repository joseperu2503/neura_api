import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class ChatPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsArray()
  @IsOptional()
  files: Express.Multer.File[];

  // @IsUUID()
  @IsString()
  chatId: string;
}
