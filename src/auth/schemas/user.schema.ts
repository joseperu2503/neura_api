import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ unique: true, sparse: true })
  guestId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
