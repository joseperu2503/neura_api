import { Injectable } from '@nestjs/common';
import {
  ortographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
} from './uses-cases';
import { OrtographyDto, ProsConsDiscusserDto } from './dto';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.API_KEY,
  });

  async ortographyCheck(ortographyDto: OrtographyDto) {
    return await ortographyCheckUseCase(this.openai, {
      prompt: ortographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }
}
