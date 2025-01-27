import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        const dbName = configService.get<string>('DB_NAME');

        const uri = `mongodb://${host}:${port}/${dbName}`;

        return { uri };
      },
    }),
  ],
})
export class DatabaseModule {}
