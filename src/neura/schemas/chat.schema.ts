import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

export class Message {
  @Prop({ required: true })
  role: 'user' | 'assistant' | 'system';

  @Prop({ required: true })
  content: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Chat {
  @Prop({ default: null })
  userId: string | null;

  @Prop({ type: [Message], default: [] })
  messages: Message[];

  @Prop({ default: '' })
  title: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
