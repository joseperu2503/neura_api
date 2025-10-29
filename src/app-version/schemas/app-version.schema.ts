import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppVersionDocument = AppVersion & Document;

@Schema({ timestamps: true, collection: 'app-versions' })
export class AppVersion {
  @Prop({ required: true, type: String, enum: ['ios', 'android'] })
  platform: 'ios' | 'android';

  @Prop({ required: true, type: String })
  version: string; // ej: "1.2.0"

  @Prop({ default: true, type: Boolean })
  isActive: boolean;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);
