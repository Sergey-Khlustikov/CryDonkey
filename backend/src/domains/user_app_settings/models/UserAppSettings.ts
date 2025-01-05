import mongoose, {Document, Model, Schema} from 'mongoose';
import User from "#src/domains/user/models/User.js";
import AdsPowerAddress from "#src/domains/ads/models/AdsPowerAddress.js";

export interface IUserAppSettings extends Document {
  userId: Schema.Types.ObjectId;
  activeAdsPowerAddress: Schema.Types.ObjectId;
  language: string;
}

const schema: Schema<IUserAppSettings> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
    unique: true,
  },
  activeAdsPowerAddress: {
    type: Schema.Types.ObjectId,
    ref: AdsPowerAddress.modelName,
  },
  language: {
    type: String,
    default: 'en',
  },
});

const UserAppSettings: Model<IUserAppSettings> = mongoose.model<IUserAppSettings>('User.AppSettings', schema);

export default UserAppSettings;
