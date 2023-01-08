import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUtil } from './entities/JwtUtil.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    const { user: userJwtPayload } = context.switchToHttp().getRequest();
    const user = new JwtUtil(userJwtPayload);
    return user.isAdmin() || user.hasPermission(requiredPermission);
  }
}
