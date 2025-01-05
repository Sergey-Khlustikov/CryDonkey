import User, {IUser} from "#src/domains/user/models/User.js";
import EventBus from "#src/events/EventBus.js";
import EEventTypes from "#src/events/structures/EEventTypes.js";
import UserCreatedEvent from "#src/domains/user/events/UserCreatedEvent.js";
import UserDeletedEvent from "#src/domains/user/events/UserDeletedEvent.js";

export class UserRepository {
  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({username});
  }

  async create(data: IUser): Promise<IUser> {
    const user: IUser = await User.create({
      username: data.username,
      password: data.password,
      role: data.role,
    });

    EventBus.emit(EEventTypes.UserCreated, new UserCreatedEvent(user))

    return user;
  }

  async getList(): Promise<IUser[]> {
    return User.find();
  }

  async deleteById(userId: string): Promise<IUser | null> {
    const user: IUser | null = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    EventBus.emit(EEventTypes.UserDeleted, new UserDeletedEvent(user));

    return user
  }
}
