import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CompletionDto } from '../dto/completion.dto';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/auth/schemas/user.schema';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @JwtAuth()
  async createChat(@GetUser() user: UserDocument) {
    return this.chatService.createChat(user.id);
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
  ) {
    return this.chatService.completion(user.id, completionDto);
  }
}
