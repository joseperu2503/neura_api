import { Module } from '@nestjs/common';
import { GptService } from './services/gpt.service';
import { GptController } from './controllers/gpt.controller';

@Module({
  controllers: [GptController],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
