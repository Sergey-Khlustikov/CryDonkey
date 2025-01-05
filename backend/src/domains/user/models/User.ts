import mongoose, {Document, Schema} from 'mongoose';
import EUserRoles from "#src/domains/user/structures/EUserRoles.js";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  role: EUserRoles;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [EUserRoles.ADMIN, EUserRoles.USER],
    required: true
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
}

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
