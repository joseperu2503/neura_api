import { Injectable } from '@nestjs/common';
import { QuestionParams } from 'src/common/intefaces/question-params';
import { GeminiService } from 'src/gemini/services/gemini.service';
import { GptService } from 'src/gpt/services/gpt.service';

@Injectable()
export class PromptToQuizService {
  constructor(
    private geminiService: GeminiService,
    private gptService: GptService,
  ) {}

  public async generateQuiz(prompt: string) {
    return this.gptService.generateQuiz(prompt);
  }

  public async *explainAnswer(
    question: QuestionParams,
    answer: number,
  ): AsyncGenerator<string> {
    const stream = this.gptService.explainAnswer(question, answer);

    let assistantMessage = '';

    for await (const chunk of stream) {
      yield chunk;
      assistantMessage += chunk;
    }
  }
}
