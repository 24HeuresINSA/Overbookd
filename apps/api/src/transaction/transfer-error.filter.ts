import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { TransferError } from "@overbookd/personal-account";
import { Response } from "express";

@Catch(TransferError)
export class TransferErrorFilter implements ExceptionFilter {
  catch(exception: TransferError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
