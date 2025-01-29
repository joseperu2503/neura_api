import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CompletionDto } from '../dto/completion.dto';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { Response } from 'express';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @JwtAuth()
  async createChat(@GetUser() user: UserDocument) {
    return this.chatService.createChat(user.id);
  }

  @Post('guest')
  async createGuestChat() {
    return this.chatService.createGuestChat();
  }

  @Get(':chatId')
  @JwtAuth()
  async getChat(
    @GetUser() user: UserDocument,
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChat(user.id, chatId);
  }

  @Get()
  @JwtAuth()
  async getChats(@GetUser() user: UserDocument) {
    return this.chatService.getChats(user.id);
  }

  @Post('completion')
  @JwtAuth()
  async completion(
    @GetUser() user: UserDocument,
    @Body() completionDto: CompletionDto,
    @Res() res: Response,
  ) {
    const stream = await this.chatService.completion(user.id, completionDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  }

  @Post('guest/completion')
  async guestCompletion(
    @Body() completionDto: CompletionDto,
    @Res() res: Response,
  ) {
    const stream = await this.chatService.completion(null, completionDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  }
}
