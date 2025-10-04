/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PollDocument = Poll & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ type: Map, of: [String], default: {} })
  votes: Map<string, string[]>;

  @Prop({ required: true })
  visibility: 'public' | 'private';

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  allowedUsers: string[];

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ default: false })
  isExpired: boolean;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
