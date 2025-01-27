import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@src/modules/user/services/user.service.js';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto.js';
import { Roles } from '@src/modules/user/decorators/roles.decorator.js';
import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';
import { UserEntity } from '@src/modules/user/entities/user.entity.js';
import { BaseController } from '@src/common/controllers/base.controller.js';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  async getList() {
    const users = await this.userService.getList();
    return this.createResponse<UserEntity[]>(UserEntity.fromArray(users));
  }

  @Post()
  @Roles(EUserRoles.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return this.createResponse<UserEntity>(
      UserEntity.fromObject(user),
      'User created successfully.',
    );
  }

  @Delete(':id')
  @Roles(EUserRoles.ADMIN)
  async delete(@Param('id') userId: string) {
    await this.userService.deleteById(userId);
    return this.createEmptyResponse('User deleted successfully.');
  }

  @Get('me')
  async me(@Request() req: any) {
    const user = await this.userService.findUserById(req.authUser._id);
    return this.createResponse<UserEntity>(UserEntity.fromObject(user));
  }
}
