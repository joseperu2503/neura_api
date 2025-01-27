import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { GptModule } from 'src/gpt/gpt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
    ]),
    GptModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class NeuraModule {}
