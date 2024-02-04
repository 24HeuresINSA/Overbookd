import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { MealSharingError } from "@overbookd/personal-account";
import { Response, Request } from "express";
import { RouteLogger } from "../../route-logger";

@Catch(MealSharingError)
export class MealSharingErrorFilter implements ExceptionFilter {
  catch(exception: MealSharingError, host: ArgumentsHost) {
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
