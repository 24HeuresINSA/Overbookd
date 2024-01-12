import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response, Request } from "express";
import { SignageError } from "@overbookd/signa";
import { RouteLogger } from "../route-logger";

@Catch(SignageError)
export class CatalogSignageErrorFilter implements ExceptionFilter {
  catch(exception: SignageError, host: ArgumentsHost) {
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
