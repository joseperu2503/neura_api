import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: 'El userId es obligatorio.' })
  userId: string;
}
