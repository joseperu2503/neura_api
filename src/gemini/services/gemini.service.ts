import { Content, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from '../dto/basic-prompt.dto';
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

  async *basicPromptStream(
    basicPromptDto: BasicPromptDto,
  ): AsyncGenerator<string> {
    const stream = await basicPromptStreamUseCase(this.ai, basicPromptDto);

    for await (const chunk of stream) {
      yield chunk.text;
    }
  }

  async *chatStream(options: {
    prompt: string;
    history: MessageParam[];
    files: Express.Multer.File[];
  }) {
    const { prompt, files, history } = options;

    const historyGemini = history.map((message) => {
      const role = message.role === 'user' ? 'user' : 'model';
      return {
        role: role,
        parts: [
          {
            text: message.content,
          },
        ],
      };
    });

    const stream = await chatPromptStreamUseCase(
      this.ai,
      prompt,
      files,
      historyGemini,
    );

    for await (const chunk of stream) {
      yield chunk.text;
    }
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
