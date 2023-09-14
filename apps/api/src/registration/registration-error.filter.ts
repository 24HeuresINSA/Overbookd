import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { ForgetMemberError, RegistrationError } from "@overbookd/registration";
import { Response } from "express";

@Catch(RegistrationError)
export class RegistrationErrorFilter implements ExceptionFilter {
  catch(exception: RegistrationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.reasons.join("\n"),
      error: "Bad Request",
      statusCode: 400,
    });
  }
}

@Catch(ForgetMemberError)
export class ForgetMemberErrorFilter implements ExceptionFilter {
  catch(exception: ForgetMemberError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
