import { Body, Controller, Post } from '@nestjs/common';
import { Prompt2QuizRequestDto } from '../dto/prompt-2-quiz-request.dto';
import { PromptToQuizService } from '../services/prompt-to-quiz.service';

@Controller('prompt2quiz')
export class Prompt2QuizController {
  constructor(private readonly prompt2QuizService: PromptToQuizService) {}

  @Post('generate-quiz')
  async generateQuiz(@Body() request: Prompt2QuizRequestDto) {
    return this.prompt2QuizService.generateQuiz(request.prompt);
  }
}
