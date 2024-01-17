import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { FestivalTaskError } from "@overbookd/festival-event";
import { Response, Request } from "express";
import { RouteLogger } from "../../route-logger";

@Catch(FestivalTaskError)
export class FestivalTaskErrorFilter implements ExceptionFilter {
  catch(exception: FestivalTaskError, host: ArgumentsHost) {
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
