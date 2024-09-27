import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { RouteLogger } from "./route-logger";
import { BaseExceptionFilter } from "@nestjs/core";

const SERVER_ERROR_MESSAGE =
  "Oups, une erreur s'est produite.. Réessaie et contacte un admin si le problème persiste.";

@Catch()
export class InternalServerErrorFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { method, url } = ctx.getRequest<Request>();
    const statusCode = 500;

    RouteLogger.logRouteContext({ statusCode, method, url });
    RouteLogger.logErrorMessage(exception);

    response
      .status(statusCode)
      .json({ statusCode, message: SERVER_ERROR_MESSAGE });
  }
}
