import { Logger } from "@nestjs/common";

type RouteContext = {
  statusCode: number;
  method: string;
  url: string;
};

export class RouteLogger {
  private static readonly logger = new Logger(RouteLogger.name);

  static logRouteContext({ statusCode, method, url }: RouteContext) {
    const logMessage = `[${statusCode}] ${method} ${url}`;
    RouteLogger.logger.log(logMessage);
  }

  static logErrorMessage(error: Error) {
    RouteLogger.logger.debug(error.message);
  }
}
