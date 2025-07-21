import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/modules/database/database.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthGuard } from '@src/modules/auth/guards/auth.guard.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@src/modules/user/guards/roles.guard.js';
import { UserModule } from '@src/modules/user/user.module.js';
import { UserAppSettingsModule } from '@src/modules/user_app_settings/user-app-settings.module.js';
import { AdsPowerModule } from '@src/modules/ads-power/ads-power.module.js';
import { AuthModule } from '@src/modules/auth/auth.module.js';
import { OpenAiModule } from '@src/modules/open-ai/open-ai.module.js';
import { BullModule } from '@nestjs/bullmq';
import { ProjectQueuesManagerModule } from '@src/modules/projects/project-queues-manager.module.js';
import { IdaoModule } from '@src/modules/projects/idao/idao.module.js';
import { RcadeModule } from '@src/modules/projects/rcade/rcade.module.js';
import { DawnExtensionModule } from '@src/modules/extensions/dawn/dawn-extension.module.js';
import { DawnModule } from '@src/modules/projects/dawn/dawn.module.js';
import { BlumModule } from '@src/modules/projects/blum/blum.module.js';
import { TwitterModule } from '@src/modules/twitter/twitter.module.js';
import { SeederModule } from '@src/seeders/seeder.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    SeederModule,

    AuthModule,
    UserModule,
    UserAppSettingsModule,
    AdsPowerModule,
    OpenAiModule,
    ProjectQueuesManagerModule,
    IdaoModule,
    RcadeModule,
    DawnExtensionModule,
    DawnModule,
    BlumModule,
    TwitterModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
