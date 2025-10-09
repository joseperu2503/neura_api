import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { CompletionRequestDto } from '../dto/completion-request.dto';
import { GetChatRequestDto } from '../dto/get-chat-request.dto';
import { MessageFeedbackRequestDto } from '../dto/message-feedback-request.dto';
import { ChatService } from '../services/chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('create')
  @JwtAuth()
  async createChat(@GetUser() user: UserDocument) {
    return this.chatService.createChat(user.id);
  }

  @Post('details')
  @JwtAuth()
  async getChat(
    @GetUser() user: UserDocument,
    @Body() request: GetChatRequestDto,
  ) {
    const chat = await this.chatService.findChat(user.id, request.chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  @Get()
  @JwtAuth()
  async getChats(@GetUser() user: UserDocument) {
    return this.chatService.getChats(user.id);
  }

  @Post('completion')
  @JwtAuth()
  @UseInterceptors(FilesInterceptor('files'))
  async completion(
    @GetUser() user: UserDocument,
    @Body() request: CompletionRequestDto,
    @Res() res: Response,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const { chatId, prompt } = request;

    const stream = this.chatService.completion(user.id, chatId, prompt, files);

    // Configuramos la respuesta como JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const text of stream) {
      // Escribimos el fragmento de texto en la respuesta
      res.write(text);
    }

    res.end(); // Finalizamos la respuesta
  }

  @Post('message-feedback')
  @JwtAuth()
  async aproveMessage(
    @GetUser() user: UserDocument,
    @Body() request: MessageFeedbackRequestDto,
  ) {
    return this.chatService.feedbackMessage(request, user);
  }
}
