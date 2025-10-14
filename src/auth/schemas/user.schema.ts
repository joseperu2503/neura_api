import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, unique: true, sparse: true })
  email?: string;

  @Prop({ type: String, select: false })
  password?: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Boolean, default: false })
  isGuest: boolean;

  @Prop({ type: String, unique: true, sparse: true })
  guestId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
