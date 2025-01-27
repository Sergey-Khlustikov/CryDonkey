import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@src/modules/user/services/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@src/common/modules/hash/hash.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findByUsername(username);

    if (!(await this.hashService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync({
        _id: user._id,
        username: user.username,
        role: user.role,
      }),
    };
  }
}
