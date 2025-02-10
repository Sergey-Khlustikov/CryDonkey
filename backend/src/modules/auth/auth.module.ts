import { Module } from '@nestjs/common';
import { UserModule } from '@src/modules/user/user.module.js';
import { AuthController } from '@src/modules/auth/controllers/auth.controller.js';
import { AuthService } from '@src/modules/auth/services/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashModule } from '@src/common/modules/hash/hash.module.js';

@Module({
  imports: [
    UserModule,
    HashModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '14d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
