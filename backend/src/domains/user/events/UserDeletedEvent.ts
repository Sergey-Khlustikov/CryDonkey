import {IUser} from "#src/domains/user/models/User.js";

class UserDeletedEvent {
  constructor(public readonly user: IUser) {
  }
}

export default UserDeletedEvent;
