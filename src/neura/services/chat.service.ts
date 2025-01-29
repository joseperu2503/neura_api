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
    return this.chatModel
      .find({ userId })
      .select('-messages') // Excluye el campo 'messages'
      .sort({ updatedAt: -1 }) // Ordena por 'updatedAt' de mayor a menor
      .exec();
  }

  async completion(userId: string, completionDto: CompletionDto) {
    const { chatId, content } = completionDto;

    // Buscar el chat en la base de datos
    const chat = await this.chatModel.findOne({ userId, _id: chatId }).exec();

    if (!chat) {
      throw new Error('Chat not found');
    }

    // Agregar el mensaje del usuario al chat
    chat.messages.push({
      role: 'user',
      content,
      createdAt: new Date(),
    });

    // Si es el primer mensaje del usuario, establecer un título
    if (chat.messages.length === 1) {
      chat.title = this.generateChatTitle(content); // Generar un título basado en el contenido
    }

    // Obtener la respuesta del asistente (usando tu servicio GPT)
    const response = await this.gptService.chatWithHistory(chat.messages);

    // Agregar la respuesta del asistente al chat
    chat.messages.push({
      role: 'assistant',
      content: response,
      createdAt: new Date(),
    });

    // Guardar el chat actualizado en la base de datos
    await chat.save();

    return { response };
  }

  // Función para generar un título basado en el contenido del primer mensaje
  generateChatTitle(content: string): string {
    // Lógica para generar un título (puedes personalizarla)
    const maxTitleLength = 50; // Longitud máxima del título
    const title = content.slice(0, maxTitleLength).trim(); // Tomar las primeras palabras
    return title || 'Nuevo Chat'; // Si no hay contenido, usar un título por defecto
  }
}
