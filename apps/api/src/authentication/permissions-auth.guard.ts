import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "@overbookd/permission";
import { JwtUtil } from "./entities/jwt-util.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<Permission>(
      "permission",
      context.getHandler(),
    );

    const { user: userJwtPayload } = context.switchToHttp().getRequest();
    const user = new JwtUtil(userJwtPayload);
    return user.can(requiredPermission);
  }
}
