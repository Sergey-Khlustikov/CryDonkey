import mongoose from 'mongoose';
import ENV from '../structures/env.mjs';

const connectDB = async () => {
  const dbConnectionURI = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;

  try {
    await mongoose.connect(dbConnectionURI, {
      useNewUrlParser: true,
    });
    console.log('[OK] DB is connected');
  } catch (err) {
    console.error('[ERROR] DB connection failed', err);
    process.exit(1);
  }
};

export default connectDB;
