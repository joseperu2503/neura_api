import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ _id: true })
export class AssistantFile {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  url: string;
}

const AssistantFileSchema = SchemaFactory.createForClass(AssistantFile);

@Schema({ _id: true }) // Esto asegura que cada mensaje tenga su _id
export class Message {
  @Prop({ required: true })
  role: 'user' | 'assistant' | 'system';

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  feedbackDescription?: string;

  @Prop({ type: String, enum: ['GOOD', 'BAD'], default: null })
  feedbackType?: 'GOOD' | 'BAD' | null;

  @Prop({ type: AssistantFileSchema, required: false })
  assistantFile?: AssistantFile;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: String, default: null })
  userId?: string | null;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Types.DocumentArray<Message>;

  @Prop({ default: '' })
  title: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
