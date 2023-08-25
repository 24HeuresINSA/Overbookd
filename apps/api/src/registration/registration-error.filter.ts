import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { RegistrationError } from "@overbookd/registration";
import { Response } from "express";

@Catch(RegistrationError)
export class RegistrationErrorFilter implements ExceptionFilter {
  catch(exception: RegistrationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.reasons,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
