import { BaseSeeder } from '@src/seeders/seeds/base.seeder.js';
import { Injectable } from '@nestjs/common';
import { UserService } from '@src/modules/user/services/user.service.js';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto.js';
import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';

@Injectable()
export class UserSeeder extends BaseSeeder {
  name = 'UserSeeder';

  constructor(private readonly userService: UserService) {
    super();
  }

  async seed(): Promise<void> {
    await this.seedAdmin();
  }

  async seedAdmin(): Promise<void> {
    const userExists = await this.userService.existsByUsername('admin');

    if (!userExists) {
      const admin: CreateUserDto = {
        username: 'admin',
        password: '123456',
        role: EUserRoles.ADMIN,
      };

      await this.userService.create(admin);
    }
  }
}
