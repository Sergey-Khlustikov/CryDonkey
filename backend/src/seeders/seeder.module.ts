import { Module } from '@nestjs/common';
import { UserSeeder } from '@src/seeders/seeds/user.seeder.js';
import { UserModule } from '@src/modules/user/user.module.js';

@Module({
  imports: [UserModule],
  providers: [UserSeeder],
})
export class SeederModule {
}
