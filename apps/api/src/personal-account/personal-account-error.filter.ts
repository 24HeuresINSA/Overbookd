import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import {
  BarrelNotConfigured,
  SimilarBarrelExist,
} from "@overbookd/personal-account";
import { Response } from "express";

@Catch(BarrelNotConfigured)
export class BarrelNotConfiguredFilter implements ExceptionFilter {
  catch(exception: BarrelNotConfigured, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      message: exception.message,
      error: "Not Found",
      statusCode: 404,
    });
  }
}

@Catch(SimilarBarrelExist)
export class SimilarBarrelExistFilter implements ExceptionFilter {
  catch(exception: SimilarBarrelExist, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
