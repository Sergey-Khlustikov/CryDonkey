import mongoose, {Document, Model, Schema} from "mongoose";
import User from "#src/domains/user/models/User.js";

export interface IAdsPowerAddress extends Document {
  userId: Schema.Types.ObjectId,
  name: string,
  host: string,
  port: number,
}

const schema: Schema<IAdsPowerAddress> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  }
})

const AdsPowerAddress: Model<IAdsPowerAddress> = mongoose.model<IAdsPowerAddress>('AdsPowerAddress', schema);

export default AdsPowerAddress;
