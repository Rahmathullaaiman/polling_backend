/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ type: Object, default: {} })
  permissions: {
    isAdmin?: boolean;
    canEdit?: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
