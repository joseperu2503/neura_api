import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { CompletionDto } from '../dto/completion.dto';
import { GptService } from 'src/gpt/gpt.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>,

    private gptService: GptService,
  ) {}

  async createChat(userId: string): Promise<Chat> {
    const newChat = new this.chatModel({
      userId,
      messages: [],
    });

    return newChat.save();
  }

  async getChat(userId: string, chatId: string): Promise<Chat> {
    return this.chatModel.findOne({ userId, _id: chatId }).exec();
  }

  async getChats(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ userId }).exec();
  }

  async completion(userId: string, completionDto: CompletionDto) {
    const { chatId, content } = completionDto;

    const chat = await this.chatModel.findOne({ userId, _id: chatId }).exec();

    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.messages.push({
      role: 'user',
      content,
      createdAt: new Date(),
    });

    const response = await this.gptService.chatWithHistory(chat.messages);

    chat.messages.push({
      role: 'system',
      content: response,
      createdAt: new Date(),
    });

    await chat.save();

    return { response };
  }
}
