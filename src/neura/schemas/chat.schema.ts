import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ _id: true }) // Esto asegura que cada mensaje tenga su _id
export class Message {
  @Prop({ required: true })
  role: 'user' | 'assistant' | 'system';

  @Prop({ required: true })
  content: string;
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  approved?: boolean;

  @Prop({ default: false })
  disapproved?: boolean;

  @Prop()
  disapprovalReason?: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ default: null })
  userId: string | null;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Types.DocumentArray<Message>;

  @Prop({ default: '' })
  title: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
