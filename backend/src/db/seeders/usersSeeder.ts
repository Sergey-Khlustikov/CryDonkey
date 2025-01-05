import EUserRoles from "#src/domains/user/structures/EUserRoles.js";
import {IUser} from "#src/domains/user/models/User.js";
import {UserRepository} from "#src/domains/user/repositories/UserRepository.js";
import UserAppSettings from "#src/domains/user_app_settings/models/UserAppSettings.js";

const users: IUser[] = [
  {
    username: 'admin',
    password: '123456',
    role: EUserRoles.ADMIN,
  } as IUser,
];

export const usersSeeder = async () => {
  for (let user of users) {
    const createdUser = await new UserRepository().create(user);
    await UserAppSettings.create({userId: createdUser._id});
  }
  console.log('UserSeeded completed');
};
