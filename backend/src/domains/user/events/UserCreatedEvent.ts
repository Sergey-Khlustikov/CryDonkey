import {IUser} from "#src/domains/user/models/User.js";

class UserCreatedEvent {
  constructor(public readonly user: IUser) {
  }
}

export default UserCreatedEvent;
