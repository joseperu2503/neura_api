import { Content, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from '../dto/basic-prompt.dto';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { ImageGenerationDto } from '../dto/image-generation.dto';
import { PokemonHelperDto } from '../dto/pokemon-helper.dto';
import { TriviaQuestionDto } from '../dto/trivia-question.dto';
import { basicPromptStreamUseCase } from '../use-cases/basic-prompt-stream.use-case';
import { basicPromptUseCase } from '../use-cases/basic-prompt.use-case';
import { chatPromptStreamUseCase } from '../use-cases/chat-prompt-stream.use-case';
import { getPokemonHelpUseCase } from '../use-cases/get-pokemon-help.use-case';
import { getTriviaQuestionUseCase } from '../use-cases/get-trivia-question.use-case';
import { imageGenerationUseCase } from '../use-cases/image-generation.use-case';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  private chatHistory = new Map<string, Content[]>();

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }

  async chatStream(chatPromptDto: ChatPromptDto) {
    const chatHistory = this.getChatHistory(chatPromptDto.chatId);
    return chatPromptStreamUseCase(this.ai, chatPromptDto, {
      history: chatHistory,
    });
  }

  saveMessage(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);
    messages.push(message);
    this.chatHistory.set(chatId, messages);
  }

  getChatHistory(chatId: string) {
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }

  imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return imageGenerationUseCase(this.ai, imageGenerationDto);
  }

  getPokemonHelp(pokemonHelperDto: PokemonHelperDto) {
    return getPokemonHelpUseCase(this.ai, pokemonHelperDto);
  }

  getTriviaQuestion(triviaQuestionDto: TriviaQuestionDto) {
    return getTriviaQuestionUseCase(this.ai, triviaQuestionDto);
  }
}
