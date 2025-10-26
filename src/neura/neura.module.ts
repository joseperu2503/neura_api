import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { GeminiModule } from 'src/gemini/gemini.module';
import { GptModule } from '../gpt/gpt.module';
import { ChatController } from './controllers/chat.controller';
import { Prompt2QuizController } from './controllers/prompt-2-quiz.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatService } from './services/chat.service';
import { PromptToQuizService } from './services/prompt-to-quiz.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    GptModule,
    AuthModule,
    GeminiModule,
  ],
  controllers: [ChatController, Prompt2QuizController],
  providers: [ChatService, PromptToQuizService],
})
export class NeuraModule {}
