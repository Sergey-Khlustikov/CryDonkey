import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@src/modules/auth/services/auth.service.js';
import { LoginDto } from '@src/modules/auth/dto/login.dto.js';
import { PublicRoute } from '@src/common/decorators/public-route.decorator.js';
import { BaseController } from '@src/common/controllers/base.controller.js';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.createResponse(
      await this.authService.login(loginDto.username, loginDto.password),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return this.createEmptyResponse('Successfully logged out');
  }
}
