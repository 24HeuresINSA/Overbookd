import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseFilters,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { RegistrationRequestDto } from "./dto/registration.request.dto";
import { RegistrationService } from "./registration.service";
import { RegistrationErrorFilter } from "./registration-error.filter";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import {
  RegistrationCompletedStepResponseDto,
  RegistrationFormStepResponseDto,
  RegistrationLoginStepResponseDto,
} from "./dto/registration-step.response.dto";
import {
  RegistrationFormStep,
  RegistrationLoginStep,
  RegistrationCompletedStep,
} from "@overbookd/http";
import { Public } from "../../authentication-zitadel/decorators/public.decorator";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";
import { AuthenticatedUser } from "../../authentication-zitadel/decorators/authenticated-user.decorator";

@Controller("registrations")
@ApiTags("registration")
@ApiSwaggerResponse()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Get("unauthenticated/check")
  @Public()
  @ApiQuery({
    type: String,
    name: "email",
    description: "Email to check",
  })
  @ApiResponse({
    status: 200,
    description: "Next Registration step",
    schema: {
      anyOf: [
        { $ref: getSchemaPath(RegistrationLoginStepResponseDto) },
        { $ref: getSchemaPath(RegistrationFormStepResponseDto) },
      ],
    },
  })
  checkUnauthenticatedUser(
    @Query("email") email: string,
  ): Promise<RegistrationLoginStep | RegistrationFormStep> {
    return this.registrationService.checkUnauthenticatedUser(email);
  }

  @Get("authenticated/check")
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Next Registration step",
    schema: {
      anyOf: [
        { $ref: getSchemaPath(RegistrationFormStepResponseDto) },
        { $ref: getSchemaPath(RegistrationCompletedStepResponseDto) },
      ],
    },
  })
  checkAuthenticatedUser(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<RegistrationFormStep | RegistrationCompletedStep> {
    return this.registrationService.checkAuthenticatedUser(user);
  }

  @Post()
  @Public()
  @UseFilters(RegistrationErrorFilter)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Newcomer registered",
  })
  @ApiBody({
    description: "Register a newcomer",
    type: RegistrationRequestDto,
  })
  registerNewcomer(
    @Body() { newcomer, token }: RegistrationRequestDto,
  ): Promise<void> {
    return this.registrationService.register(newcomer, token);
  }
}
