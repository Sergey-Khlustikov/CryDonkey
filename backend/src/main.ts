import './config/aliases';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  const port = configService.get('EXPRESS_SERVER_PORT') || 3000;
  await app.listen(port, () => {
    console.log(`Nest app listening on port ${port}`);
  });
}

bootstrap();
