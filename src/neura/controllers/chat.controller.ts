import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CompletionDto } from '../dto/completion.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto) {
    const { userId } = createChatDto;
    return this.chatService.createChat(userId);
  }

  @Get(':chatId')
  async getChat(@Param('chatId') chatId: string) {
    return this.chatService.getChat(chatId);
  }

  @Get('get-chats/:userId')
  async getChats(@Param('userId') userId: string) {
    return this.chatService.getChats(userId);
  }

  @Post('completion')
  async completion(@Body() completionDto: CompletionDto) {
    return this.chatService.completion(completionDto);
  }
}
