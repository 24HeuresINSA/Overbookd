import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { AvailabilityError } from "@overbookd/volunteer-availability";
import { Response, Request } from "express";
import { RouteLogger } from "../route-logger";

@Catch(AvailabilityError)
export class VolunteerAvailabilityErrorFilter implements ExceptionFilter {
  catch(exception: AvailabilityError, host: ArgumentsHost) {
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
