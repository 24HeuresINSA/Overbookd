import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ContributionError } from "@overbookd/contribution";
import { Request, Response } from "express";
import { RouteLogger } from "../route-logger";

@Catch(ContributionError)
export class ContributionErrorFilter implements ExceptionFilter {
  catch(exception: ContributionError, host: ArgumentsHost) {
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
