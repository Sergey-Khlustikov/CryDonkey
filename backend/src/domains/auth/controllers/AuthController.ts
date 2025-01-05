import {Request, Response} from 'express';
import {AuthService} from "#src/domains/auth/services/AuthService.js";

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    const {username, password} = req.body;

    try {
      const token = await this.authService.login(username, password);
      res.status(200).json({message: 'Login successful', token});
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({message: 'Logged out'});
  }
}
