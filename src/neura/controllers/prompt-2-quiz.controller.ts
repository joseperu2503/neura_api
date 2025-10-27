import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExplainAnswerRequestDto } from '../dto/explain-answer-request.dto';
import { Prompt2QuizRequestDto } from '../dto/prompt-2-quiz-request.dto';
import { PromptToQuizService } from '../services/prompt-to-quiz.service';

@Controller('prompt2quiz')
export class Prompt2QuizController {
  constructor(private readonly prompt2QuizService: PromptToQuizService) {}

  @Post('generate-quiz')
  async generateQuiz(@Body() request: Prompt2QuizRequestDto) {
    return this.prompt2QuizService.generateQuiz(request.prompt);
  }

  @Post('explain-answer')
  async explainAnswer(
    @Body() request: ExplainAnswerRequestDto,
    @Res() res: Response,
  ) {
    const stream = this.prompt2QuizService.explainAnswer(
      request,
      request.answer,
    );

    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await (const text of stream) {
      res.write(text);
    }

    res.end();
  }
}
