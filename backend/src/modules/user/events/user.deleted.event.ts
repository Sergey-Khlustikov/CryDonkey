import { UserDocument } from '@src/modules/user/schemas/user.schema.js';

export class UserDeletedEvent {
  public static readonly eventName = 'user.deleted';

  constructor(public user: UserDocument) {}
}
