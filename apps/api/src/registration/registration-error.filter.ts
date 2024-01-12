import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { ForgetMemberError, RegistrationError } from "@overbookd/registration";
import { Response, Request } from "express";
import { RouteLogger } from "../route-logger";

@Catch(RegistrationError)
export class RegistrationErrorFilter implements ExceptionFilter {
  catch(exception: RegistrationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url } = ctx.getRequest<Request>();
    const statusCode = 400;

    RouteLogger.logRouteContext({ statusCode, method, url });
    RouteLogger.logErrorMessage(exception);

    response.status(statusCode).json({
      message: exception.reasons.join("\n"),
      error: "Bad Request",
      statusCode,
    });
  }
}

@Catch(ForgetMemberError)
export class ForgetMemberErrorFilter implements ExceptionFilter {
  catch(exception: ForgetMemberError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url } = ctx.getRequest<Request>();
    const statusCode = 400;

    RouteLogger.logRouteContext({ statusCode, method, url });
    RouteLogger.logErrorMessage(exception);

    response.status(statusCode).json({
      message: exception.message,
      error: "Bad Request",
      statusCode,
    });
  }
}
