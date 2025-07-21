import '../config/aliases';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { BaseSeeder } from '@src/seeders/seeds/base.seeder.js';
import { UserSeeder } from '@src/seeders/seeds/user.seeder.js';
import { AppModule } from '@src/app.module.js';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const allSeeders: BaseSeeder[] = [appContext.get(UserSeeder)];

  const args = process.argv.slice(2);
  const only = args
    .filter((a) => a.startsWith('--seeder='))
    .map((a) => a.split('=')[1]);

  const toRun = only.length
    ? allSeeders.filter((s) => only.includes(s.name))
    : allSeeders;

  if (!toRun.length) {
    console.error(
      `❌ No matching seeders [${only.join(', ')}], available: ` +
      allSeeders.map((s) => s.name).join(', '),
    );
    process.exit(1);
  }

  for (const seeder of toRun) {
    await seeder.run();
  }

  await appContext.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
