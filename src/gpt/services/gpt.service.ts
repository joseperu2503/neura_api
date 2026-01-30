import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { MessageParam } from 'src/common/intefaces/message-param';
import { QuestionParams } from 'src/common/intefaces/question-params';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from '../dto';
import {
  chatWithHistoryUseCase,
  explainAnswerUseCase,
  generateQuiz,
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
    apiKey: process.env.DEEPSEEK_API_KEY,
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
    history: MessageParam[],
    prompt: string,
  ): AsyncGenerator<string> {
    const messages: ChatCompletionMessageParam[] = [
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: 'user',
        content: prompt,
      },
    ];

    const stream = await chatWithHistoryUseCase(this.openai, messages);

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      yield text; // emitir cada chunk de texto
    }
  }

  generateQuiz(prompt: string) {
    return generateQuiz(this.openai, prompt);
  }

  async *explainAnswer(
    question: QuestionParams,
    answer: number,
  ): AsyncGenerator<string> {
    const stream = await explainAnswerUseCase(this.openai, question, answer);

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      yield text; // emitir cada chunk de texto
    }
  }
}
