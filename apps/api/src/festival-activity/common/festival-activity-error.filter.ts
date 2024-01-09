import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { FestivalActivityError } from "@overbookd/festival-event";
import { Response } from "express";

@Catch(FestivalActivityError)
export class FestivalActivityErrorFilter implements ExceptionFilter {
  catch(exception: FestivalActivityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
