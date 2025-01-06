import {UserRepository} from "#src/domains/user/repositories/UserRepository.js";
import bcrypt from "bcrypt";
import {JwtUtil} from "#src/helpers/JwtUtil.js";

export class AuthService {
  private userRepository: UserRepository = new UserRepository();

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password');
    }

    return JwtUtil.generateToken({id: user._id, role: user.role});
  }
}
