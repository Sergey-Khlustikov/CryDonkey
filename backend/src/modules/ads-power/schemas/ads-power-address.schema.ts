import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@src/modules/user/schemas/user.schema.js';

@Schema()
export class AdsPowerAddress {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  port: number;
}

export type AdsPowerAddressDocument = HydratedDocument<AdsPowerAddress>;
export const AdsPowerAddressSchema =
  SchemaFactory.createForClass(AdsPowerAddress);
