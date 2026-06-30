import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_METADATA } from "../decorators/roles.decorator";
import { IS_PUBLIC_KEY } from "../decorators";
import { OIDC_ROLES_CLAIMS } from "@overbookd/oidc";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger: Logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return false;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const rolesObj = user[OIDC_ROLES_CLAIMS];

    if (!rolesObj) {
      this.logger.debug("User does not contain any role");
      return false;
    }

    const userRoles = Object.keys(rolesObj);
    return roles.some((x) => userRoles.includes(x));
  }
}
