import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response, Request } from "express";
import { RouteLogger } from "../route-logger";
import { AssignmentError } from "@overbookd/assignment";

@Catch(AssignmentError)
export class AssignmentErrorFilter implements ExceptionFilter {
  catch(exception: AssignmentError, host: ArgumentsHost) {
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
