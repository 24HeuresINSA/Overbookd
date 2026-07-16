import { AuthGuard } from "@nestjs/passport";
import { retrievePermissions } from "../../team/utils/permissions";
import { ConnectedZitadelUser } from "../zitadel-types";
import { PrismaService } from "../../prisma.service";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { lastValueFrom, Observable } from "rxjs";
import { AdditionalOverbookdUserData } from "../request-hydrated-user";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { SSE_KEY } from "../decorators/sse-auth.decorator";

export type RawRequestUserData = ConnectedZitadelUser & {
  overbookdData: AdditionalOverbookdUserData;
};

@Injectable()
export class ZitadelAuthGuard extends AuthGuard("zitadel") {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();

    const sseAuth = this.reflector.getAllAndOverride<boolean>(SSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (sseAuth) {
      if (!request.headers.authorization && request.query.token) {
        request.headers.authorization = `Bearer ${request.query.token}`;
      }
    }

    const result = await super.canActivate(context);
    const canActivate =
      result instanceof Observable ? await lastValueFrom(result) : result;

    const zitadelUser: ConnectedZitadelUser | undefined = request.user;
    if (!zitadelUser) return canActivate;

    const rawOverbookdData = await this.prisma.user.findFirst({
      where: {
        zitadelId: zitadelUser.sub,
      },
      select: {
        id: true,
        teams: {
          select: {
            team: {
              select: {
                code: true,
                permissions: {
                  select: {
                    permissionName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!rawOverbookdData) return canActivate;

    const userData: RawRequestUserData = {
      ...zitadelUser,
      overbookdData: {
        id: rawOverbookdData.id,
        permissions: retrievePermissions(rawOverbookdData.teams),
        teams: rawOverbookdData.teams.map(({ team }) => team.code),
      },
    };
    request.user = userData;

    return canActivate;
  }
}
