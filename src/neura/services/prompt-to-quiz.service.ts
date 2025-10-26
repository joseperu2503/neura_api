import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini/services/gemini.service';

@Injectable()
export class PromptToQuizService {
  constructor(private geminiService: GeminiService) {}

  public async generateQuiz(prompt: string) {
    return this.geminiService.generateQuiz(prompt);
  }
}
