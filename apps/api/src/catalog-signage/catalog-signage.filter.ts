import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { SignageError } from "@overbookd/signa";

@Catch(SignageError)
export class CatalogSignageErrorFilter implements ExceptionFilter {
  catch(exception: SignageError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
