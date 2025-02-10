import { UserDocument } from '@src/modules/user/schemas/user.schema.js';

export class UserCreatedEvent {
  public static readonly eventName = 'user.created';

  constructor(public user: UserDocument) {}
}
