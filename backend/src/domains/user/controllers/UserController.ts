import {UserRepository} from "#src/domains/user/repositories/UserRepository.js";
import {Request, Response} from "express";

export class UserController {
  private userRepository: UserRepository = new UserRepository();

  async getList(_request: Request, response: Response): Promise<void> {
    try {
      const users = await this.userRepository.getList();

      response.status(200).json(users);
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    try {
      await this.userRepository.create(request.body);

      response.status(200).json({message: 'User created successfully'});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    try {
      await this.userRepository.deleteById(request.body.id);

      response.status(200).json({message: 'User deleted successfully'});
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }

  async me(request: Request, response: Response): Promise<void> {
    try {
      const user = await this.userRepository.findUserById(request.authUser.id)
      response.status(200).json(user);
    } catch (e) {
      response.status(500).json({message: e.message});
    }
  }
}
