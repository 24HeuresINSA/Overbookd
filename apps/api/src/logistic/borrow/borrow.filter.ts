import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { BorrowError } from "@overbookd/logistic";
import { Response, Request } from "express";
import { RouteLogger } from "../../route-logger";

@Catch(BorrowError)
export class BorrowErrorFilter implements ExceptionFilter {
  catch(exception: BorrowError, host: ArgumentsHost) {
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
