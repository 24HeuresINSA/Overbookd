import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
import {
  ForgetMemberErrorFilter,
  RegistrationErrorFilter,
} from "./registration-error.filter";
import { ForgetRequestDto } from "./dto/forget.request.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import {
  RegistrationCompletedStepResponseDto,
  RegistrationFormStepResponseDto,
  RegistrationLoginStepResponseDto,
} from "./dto/registration-step.response.dto";
import { RegistrationStep } from "@overbookd/http";
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
        { $ref: getSchemaPath(RegistrationFormStepResponseDto) },
        { $ref: getSchemaPath(RegistrationLoginStepResponseDto) },
      ],
    },
  })
  checkUnauthenticatedUser(
    @Query("email") email: string,
  ): Promise<RegistrationStep> {
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
        { $ref: getSchemaPath(RegistrationLoginStepResponseDto) },
        { $ref: getSchemaPath(RegistrationCompletedStepResponseDto) },
      ],
    },
  })
  checkAuthenticatedUser(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<RegistrationStep> {
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

  @Post("forget")
  @Public()
  @UseFilters(ForgetMemberErrorFilter)
  @ApiBody({
    description: "Forget a member",
    type: ForgetRequestDto,
  })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Forget request done",
  })
  forgetMe(@Body() { token, credentials }: ForgetRequestDto) {
    return this.registrationService.forgetMe(credentials, token);
  }

  @Delete("forget/:email")
  @Public()
  @UseFilters(ForgetMemberErrorFilter)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Forget request done",
  })
  forgetHim(@Param("email") email: string): Promise<void> {
    return this.registrationService.forgetHim(email);
  }
}
