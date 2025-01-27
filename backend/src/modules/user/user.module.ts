import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@src/modules/user/schemas/user.schema';
import { Module } from '@nestjs/common';
import { UserController } from '@src/modules/user/controllers/user.controller.js';
import { UserService } from '@src/modules/user/services/user.service.js';
import { UserRepository } from '@src/modules/user/repositories/user.repository.js';
import { HashModule } from '@src/common/modules/hash/hash.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
