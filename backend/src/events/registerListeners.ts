import EventBus from "#src/events/EventBus.js";
import EEventTypes from "#src/events/structures/EEventTypes.js";
import UserCreatedUserAppSettingsListener
  from "#src/domains/user_app_settings/listeners/UserCreatedUserAppSettingsListener.js";
import UserDeletedUserAppSettingsListener
  from "#src/domains/user_app_settings/listeners/UserDeletedUserAppSettingsListener.js";

export default function registerListeners() {
  EventBus.on(EEventTypes.UserCreated, event => new UserCreatedUserAppSettingsListener().handle(event));
  EventBus.on(EEventTypes.UserDeleted, event => new UserDeletedUserAppSettingsListener().handle(event));
}
