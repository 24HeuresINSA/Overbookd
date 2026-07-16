import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestHydratedUser } from "../request-hydrated-user";

export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestHydratedUser => {
    const request = ctx.switchToHttp().getRequest();
    return RequestHydratedUser.fromRequestRawUser(request.user);
  },
);
