import mongoose from 'mongoose';

const { Schema } = mongoose;

const Record = new Schema({
  name: String,
  email: String,
  address: String,
  gender: String,
});

export default mongoose.model('Record', Record);
