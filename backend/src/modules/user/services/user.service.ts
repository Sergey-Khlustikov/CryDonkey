import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@src/modules/user/repositories/user.repository';
import { User, UserDocument } from '@src/modules/user/schemas/user.schema';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { HashService } from '@src/common/modules/hash/hash.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@src/modules/user/events/user.created.event.js';
import { UserDeletedEvent } from '@src/modules/user/events/user.deleted.event.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private hashService: HashService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    const user = await this.userRepository.create(
      createUserDto,
      hashedPassword,
    );

    this.eventEmitter.emit(
      UserCreatedEvent.eventName,
      new UserCreatedEvent(user),
    );

    return user;
  }

  async getList(): Promise<User[]> {
    return this.userRepository.getList();
  }

  async deleteById(userId: string): Promise<User> {
    const user = await this.userRepository.deleteById(userId);

    this.eventEmitter.emit(
      UserDeletedEvent.eventName,
      new UserDeletedEvent(user),
    );

    return user;
  }
}
