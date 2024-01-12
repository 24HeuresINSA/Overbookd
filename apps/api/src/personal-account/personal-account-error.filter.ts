import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import {
  BarrelNotConfigured,
  SimilarBarrelExist,
} from "@overbookd/personal-account";
import { Response, Request } from "express";
import { RouteLogger } from "../route-logger";

@Catch(BarrelNotConfigured)
export class BarrelNotConfiguredFilter implements ExceptionFilter {
  catch(exception: BarrelNotConfigured, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url } = ctx.getRequest<Request>();
    const statusCode = 404;

    RouteLogger.logRouteContext({ statusCode, method, url });
    RouteLogger.logErrorMessage(exception);

    response.status(statusCode).json({
      message: exception.message,
      error: "Not Found",
      statusCode,
    });
  }
}

@Catch(SimilarBarrelExist)
export class SimilarBarrelExistFilter implements ExceptionFilter {
  catch(exception: SimilarBarrelExist, host: ArgumentsHost) {
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
