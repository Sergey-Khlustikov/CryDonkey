import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '@src/modules/user/schemas/user.schema.js';
import { AdsPowerAddress } from '@src/modules/ads-power/schemas/ads-power-address.schema.js';

@Schema()
export class UserAppSettings {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: AdsPowerAddress.name })
  activeAdsPowerAddress?: Types.ObjectId;

  @Prop({ default: 'en' })
  language: string;
}

export type UserAppSettingsDocument = HydratedDocument<UserAppSettings>;
export const UserAppSettingsSchema =
  SchemaFactory.createForClass(UserAppSettings);
