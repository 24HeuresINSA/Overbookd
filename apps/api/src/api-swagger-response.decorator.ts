import { applyDecorators } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

export function ApiSwaggerResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: "Request is not formated as expected",
    }),
    ApiForbiddenResponse({ description: "User can't access this resource" }),
    ApiBadRequestResponse({
      description: "Request is not formated as expected",
    }),
    ApiNotFoundResponse({ description: "Can't find a requested resource" }),
    ApiUnauthorizedResponse({
      description: "User dont have the right to access this route",
    }),
    ApiBadGatewayResponse({ description: "Bad Gateway" }),
  );
}
