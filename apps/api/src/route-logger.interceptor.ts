import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, filter, tap } from "rxjs";
import { RouteLogger } from "./route-logger";

export class RouteLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { url, method } = context.switchToHttp().getRequest<Request>();
    const { statusCode } = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      filter(() => url !== "/"),
      tap(() => {
        RouteLogger.logRouteContext({ statusCode, method, url });
      }),
    );
  }
}
