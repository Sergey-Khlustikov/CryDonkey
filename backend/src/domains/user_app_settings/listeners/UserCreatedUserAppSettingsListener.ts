import UserCreatedEvent from "#src/domains/user/events/UserCreatedEvent.js";
import UserAppSettings from "#src/domains/user_app_settings/models/UserAppSettings.js";

class UserCreatedUserAppSettingsListener {
  async handle(event: UserCreatedEvent): Promise<void> {
    await UserAppSettings.create({userId: event.user.id})
  }
}

export default UserCreatedUserAppSettingsListener;
