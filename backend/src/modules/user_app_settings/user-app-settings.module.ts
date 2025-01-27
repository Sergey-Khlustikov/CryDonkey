import { Module } from '@nestjs/common';
import {
  UserAppSettings,
  UserAppSettingsSchema,
} from '@src/modules/user_app_settings/schemas/user-app-settings.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCreatedListener } from '@src/modules/user_app_settings/listeners/user.created.listener.js';
import { UserDeletedListener } from '@src/modules/user_app_settings/listeners/user.deleted.listener.js';
import { UserAppSettingsService } from '@src/modules/user_app_settings/services/user-app-settings.service.js';
import UserAppSettingsRepository from '@src/modules/user_app_settings/repositories/user-app-settings.repository.js';
import { UserAppSettingsController } from '@src/modules/user_app_settings/controllers/user-app-settings.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAppSettings.name, schema: UserAppSettingsSchema },
    ]),
  ],
  controllers: [UserAppSettingsController],
  providers: [
    UserAppSettingsService,
    UserAppSettingsRepository,
    UserCreatedListener,
    UserDeletedListener,
  ],
  exports: [UserAppSettingsService, UserAppSettingsRepository],
})
export class UserAppSettingsModule {}
