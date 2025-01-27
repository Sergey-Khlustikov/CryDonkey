import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@src/modules/user/events/user.created.event.js';
import { UserAppSettings } from '@src/modules/user_app_settings/schemas/user-app-settings.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserCreatedListener {
  constructor(
    @InjectModel(UserAppSettings.name)
    private readonly userAppSettingsModel: Model<UserAppSettings>,
  ) {}

  @OnEvent(UserCreatedEvent.eventName)
  async handle(event: UserCreatedEvent) {
    await this.userAppSettingsModel.create({ userId: event.user._id });
  }
}
