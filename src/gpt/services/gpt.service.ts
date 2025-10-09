import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from '../dto';
import {
  chatWithHistoryUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from '../uses-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
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

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudioDto.prompt,
      voice: textToAudioDto.voice,
    });
  }

  async *chatWithHistory(
    messages: ChatCompletionMessageParam[],
  ): AsyncGenerator<string> {
    const stream = await chatWithHistoryUseCase(this.openai, {
      messages,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        yield text; // emitir cada chunk de texto
      }
    }
  }
}
