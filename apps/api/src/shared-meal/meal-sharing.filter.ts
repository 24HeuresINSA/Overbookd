import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { MealSharingError } from "@overbookd/personal-account";
import { Response } from "express";

@Catch(MealSharingError)
export class MealSharingErrorFilter implements ExceptionFilter {
  catch(exception: MealSharingError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
