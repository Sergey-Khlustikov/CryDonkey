// @ts-nocheck
import mongoose from 'mongoose';
import PROFILE_SOURCES from "#src/domains/profile/structures/profileSources.js";

const TwitterAccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  linkedBrowserProfile: {
    source: {
      type: String,
      enum: Object.values(PROFILE_SOURCES),
      required: false,
    },
    profileId: {
      type: [Number, String],
      required: false,
    },
  },
}, {
  timestamps: true,
});

const TwitterAccount = mongoose.model('TwitterAccount', TwitterAccountSchema);

export default TwitterAccount;
