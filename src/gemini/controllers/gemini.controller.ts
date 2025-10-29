import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { MessageParam } from 'src/common/intefaces/message-param';
import { BasicPromptDto } from '../dto/basic-prompt.dto';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { ImageGenerationDto } from '../dto/image-generation.dto';
import { PokemonHelperDto } from '../dto/pokemon-helper.dto';
import { TriviaQuestionDto } from '../dto/trivia-question.dto';
import { GeminiService } from '../services/gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(res: Response, stream: AsyncGenerator<String>) {
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    basicPromptDto.files = files;

    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    void this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { prompt } = chatPromptDto;
    const history: MessageParam[] = this.geminiService
      .getChatHistory(chatPromptDto.chatId)
      .map(
        (message): MessageParam => ({
          role: message.role == 'user' ? 'user' : 'assistant',
          content: message.parts?.[0]?.text ?? '',
        }),
      );
    const stream = this.geminiService.chatStream({
      prompt,
      history,
      files,
    });
    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };
    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts?.map((part) => part.text).join(''),
    }));
  }

  @Post('image-generation')
  @UseInterceptors(FilesInterceptor('files'))
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    imageGenerationDto.files = files;

    const { imageUrl, text } =
      await this.geminiService.imageGeneration(imageGenerationDto);

    return {
      imageUrl,
      text,
    };
  }

  @Post('image-generation-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async imageGenerationStream(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const { prompt } = imageGenerationDto;

    const stream = this.geminiService.imageGenerationStream({
      prompt,
      files,
    });
  }

  @Post('pokemon-helper')
  getPokemonHelp(@Body() pokemonHelperDto: PokemonHelperDto) {
    return this.geminiService.getPokemonHelp(pokemonHelperDto);
  }

  @Get('trivia/question/:topic')
  getTriviaQuestion(@Param() triviaQuestionDto: TriviaQuestionDto) {
    return this.geminiService.getTriviaQuestion(triviaQuestionDto);
  }
}
