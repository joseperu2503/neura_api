import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GptService } from 'src/features/gpt/services/gpt.service';
import { Readable } from 'stream';
import { CompletionRequestDto } from '../dto/completion-request.dto';
import { Chat, ChatDocument, Message } from '../schemas/chat.schema';

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

  async getChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ userId })
      .select('-messages') // Excluye el campo 'messages'
      .sort({ updatedAt: -1 }) // Ordena por 'updatedAt' de mayor a menor
      .exec();
  }

  async completion(userId: string, completionDto: CompletionRequestDto) {
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
      chat.title = this.generateChatTitle(content);
    }

    // Guardar cambios antes de procesar la respuesta
    await chat.save();

    // Obtener la respuesta en streaming desde el modelo
    const stream = await this.gptService.chatWithHistory(chat.messages);

    // Crear un ReadableStream para enviar la respuesta en tiempo real
    const readable = new Readable({
      read() {},
    });

    let assistantMessage = '';

    // Procesar la respuesta en streaming
    (async () => {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        readable.push(text);
        assistantMessage += text;
        // console.log(text);
      }
      readable.push(null); // Cerrar el stream cuando termine

      // Guardar la respuesta final en la base de datos
      chat.messages.push({
        role: 'assistant',
        content: assistantMessage,
        createdAt: new Date(),
      });

      await chat.save();
    })();

    return readable;
  }

  // Función para generar un título basado en el contenido del primer mensaje
  private generateChatTitle(content: string): string {
    // Lógica para generar un título (puedes personalizarla)
    const maxTitleLength = 50; // Longitud máxima del título
    const title = content.slice(0, maxTitleLength).trim(); // Tomar las primeras palabras
    return title || 'Nuevo Chat'; // Si no hay contenido, usar un título por defecto
  }

  public async approveMessage(
    chat: ChatDocument,
    message: Message,
  ): Promise<Chat> {
    message.approved = true;
    message.disapproved = false;
    message.disapprovalReason = undefined;

    return chat.save();
  }

  public async disapproveMessage(
    chat: ChatDocument,
    message: Message,
    reason: string,
  ): Promise<Chat> {
    message.approved = false;
    message.disapproved = true;
    message.disapprovalReason = reason;

    return chat.save();
  }

  public async findChat(
    userId: string,
    chatId: string,
  ): Promise<ChatDocument | null> {
    const chat = await this.chatModel.findOne({ userId, _id: chatId }).lean();
    if (!chat) return null;

    return chat;
  }

  public async findMessage(
    chat: Chat,
    messageId: string,
  ): Promise<Message | null> {
    const message = chat.messages.id(messageId);
    if (!message) {
      return null;
    }
    return message;
  }
}
