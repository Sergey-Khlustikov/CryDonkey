import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@src/modules/user/schemas/user.schema.js';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto.js';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  async create(
    createUserDto: CreateUserDto,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await createdUser.save();

    return createdUser;
  }

  async getList(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }
}
