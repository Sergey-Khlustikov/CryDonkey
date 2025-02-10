import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import EUserRoles from '@src/modules/user/structures/user-roles.enum.js';
import { ROLES_KEY } from '@src/modules/user/decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<EUserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles || !allowedRoles.length) {
      return true;
    }

    const { authUser } = context.switchToHttp().getRequest();

    return allowedRoles.includes(authUser.role);
  }
}
