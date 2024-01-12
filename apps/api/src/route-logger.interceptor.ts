import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class RouteLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RouteLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const logMessage = `[${response.statusCode}] ${request.method} ${request.route.path}`;
        this.logger.log(logMessage);
      }),
    );
  }
}
