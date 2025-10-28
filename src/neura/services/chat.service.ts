import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { GeminiService } from 'src/gemini/services/gemini.service';
import { GptService } from 'src/gpt/services/gpt.service';
import { v4 as uuidV4 } from 'uuid';
import { MessageFeedbackRequestDto } from '../dto/message-feedback-request.dto';
import {
  AssistantFile,
  Chat,
  ChatDocument,
  Message,
} from '../schemas/chat.schema';

const AI_IMAGES_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'public/ai-images',
);

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>,

    private gptService: GptService,

    private geminiService: GeminiService,
  ) {}

  completionModel: 'gpt' | 'gemini' = 'gpt';

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

  async *completion(
    userId: string,
    chatId: string,
    prompt: string,
    imageGeneration: boolean,
    files?: Express.Multer.File[],
  ): AsyncGenerator<string> {
    // Buscar el chat en la base de datos
    const chat = await this.chatModel.findOne({ userId, _id: chatId }).exec();
    if (!chat) {
      throw new Error('Chat not found');
    }

    const userMsgId = new Types.ObjectId().toHexString();
    const assistantMsgId = new Types.ObjectId().toHexString();

    const history: MessageParam[] = chat.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    // Agregar el mensaje del usuario al chat
    chat.messages.push({
      _id: userMsgId,
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    });

    // Si es el primer mensaje del usuario, establecer un título
    if (chat.messages.length === 1) {
      chat.title = this.generateChatTitle(prompt);
    }

    // Guardar cambios antes de procesar la respuesta
    await chat.save();

    // Emitir el mensaje inicial con los IDs
    yield `data:${JSON.stringify({
      messageId: assistantMsgId,
      chatId: chat.id,
    })}`;

    let assistantMessage = '';
    let assistantFile: AssistantFile | null = null;

    if (!imageGeneration) {
      let stream: AsyncGenerator<string>;

      // Obtener la respuesta en streaming desde el modelo
      if (this.completionModel === 'gemini') {
        stream = this.geminiService.chatStream({
          prompt: prompt,
          history: history,
          files: files,
        });
      } else {
        stream = this.gptService.chatWithHistory(history, prompt);
      }

      // Procesar la respuesta en streaming
      for await (const chunk of stream) {
        yield chunk; // emitir chunk al cliente
        assistantMessage += chunk;
      }
    } else {
      const stream = this.geminiService.imageGenerationStream({
        prompt,
        files,
      });

      let imageUrl = '';
      const imageId = uuidV4();

      for await (const chunk of stream) {
        if (typeof chunk === 'string') {
          yield chunk;
          assistantMessage += chunk;
        } else {
          const imageName = `${imageId}.png`;
          const imageSize = chunk.length;
          const imagePath = path.join(AI_IMAGES_PATH, imageName);
          fs.writeFileSync(imagePath, chunk);
          imageUrl = `http://localhost:3000/ai-images/${imageName}`;

          assistantFile = {
            name: imageName,
            size: imageSize,
            url: imageUrl,
          };

          yield `image_data:${JSON.stringify(assistantFile)}`;
        }
      }
    }

    // Emitir final de transmisión
    yield '[DONE]';

    // Guardar la respuesta final en la base de datos
    chat.messages.push({
      _id: assistantMsgId,
      role: 'assistant',
      content: assistantMessage,
      createdAt: new Date(),
      feedbackType: null,
      feedbackDescription: '',
      assistantFile: assistantFile,
    });

    await chat.save();
  }

  // Función para generar un título basado en el contenido del primer mensaje
  private generateChatTitle(content: string): string {
    // Lógica para generar un título (puedes personalizarla)
    const maxTitleLength = 50; // Longitud máxima del título
    const title = content.slice(0, maxTitleLength).trim(); // Tomar las primeras palabras
    return title || 'Nuevo Chat'; // Si no hay contenido, usar un título por defecto
  }

  public async feedbackMessage(
    request: MessageFeedbackRequestDto,
    user: UserDocument,
  ): Promise<Chat> {
    const chat = await this.chatModel
      .findOne({ userId: user.id, _id: request.chatId })
      .exec();

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const message = chat.messages.id(request.messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.feedbackType = request.feedbackType;
    message.feedbackDescription = request.feedbackDescription;

    return chat.save();
  }

  public async findChat(
    userId: string,
    chatId: string,
  ): Promise<ChatDocument | null> {
    const chat = await this.chatModel.findOne({ userId, _id: chatId }).exec();
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
