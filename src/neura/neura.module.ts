import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { GptModule } from '../gpt/gpt.module';
import { ChatController } from './controllers/chat.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatService } from './services/chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    GptModule,
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class NeuraModule {}
