import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "@overbookd/permission";
import { RequestHydratedUser } from "../request-hydrated-user";
import { PERMISSIONS_KEY } from "../decorators/permissions-auth.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = RequestHydratedUser.fromRequestRawUser(request.user);

    return requiredPermissions.every((permission) => user.can(permission));
  }
}
