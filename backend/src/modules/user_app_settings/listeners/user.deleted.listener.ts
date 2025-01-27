import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDeletedEvent } from '@src/modules/user/events/user.deleted.event.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAppSettings } from '@src/modules/user_app_settings/schemas/user-app-settings.schema.js';

@Injectable()
export class UserDeletedListener {
  constructor(
    @InjectModel(UserAppSettings.name)
    private readonly userAppSettingsModel: Model<UserAppSettings>,
  ) {}

  @OnEvent(UserDeletedEvent.eventName)
  async handle(event: UserDeletedEvent) {
    await this.userAppSettingsModel.findByIdAndDelete(event.user.id);
  }
}
