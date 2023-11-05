import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { CatalogSignageError } from "./repository/catalog-signage-repository.prisma";

@Catch(CatalogSignageError)
export class CatalogSignageErrorFilter implements ExceptionFilter {
  catch(exception: CatalogSignageError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: "Bad Request",
      statusCode: 400,
    });
  }
}
