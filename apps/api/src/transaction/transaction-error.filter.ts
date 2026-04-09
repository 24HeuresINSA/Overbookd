import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TransactionError } from "@overbookd/personal-account";
import { Request, Response } from "express";
import { RouteLogger } from "../route-logger";

@Catch(TransactionError)
export class TransactionErrorFilter implements ExceptionFilter {
  catch(exception: TransactionError, host: ArgumentsHost) {
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
