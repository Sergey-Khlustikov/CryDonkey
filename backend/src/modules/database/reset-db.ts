import '../../config/aliases';
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module.js';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const conn = ctx.get<Connection>(getConnectionToken());
    console.log('⚠️ Dropping database…');
    await conn.dropDatabase();
    console.log('✅ Database dropped.');
  } catch (err) {
    console.error('❌ Error during database reset:', err);
    process.exit(1);
  } finally {
    await ctx.close();
    process.exit(0);
  }
}

bootstrap();
