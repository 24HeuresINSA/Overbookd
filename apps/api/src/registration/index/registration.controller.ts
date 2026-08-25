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
  ApiParam,
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
  RegistrationFormStepWithoutDataResponseDto,
  RegistrationFormStepWithDataResponseDto,
  RegistrationLoginStepResponseDto,
} from "./dto/registration-step.response.dto";
import {
  RegistrationFormStep,
  RegistrationFormStepWithData,
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

  @Get("unauthenticated/check/:email")
  @Public()
  @ApiParam({
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
        { $ref: getSchemaPath(RegistrationFormStepWithDataResponseDto) },
      ],
    },
  })
  checkUnauthenticatedUser(
    @Param("email") email: string,
  ): Promise<RegistrationLoginStep | RegistrationFormStepWithData> {
    return this.registrationService.checkUnauthenticatedUser(email);
  }

  @Get("authenticated/check")
  @ApiBearerAuth()
  @ApiQuery({
    type: Boolean,
    name: "withFormData",
    required: false,
    description: "Whether to include the user data in the response or not",
  })
  @ApiResponse({
    status: 200,
    description: "Next Registration step",
    schema: {
      anyOf: [
        { $ref: getSchemaPath(RegistrationFormStepWithDataResponseDto) },
        { $ref: getSchemaPath(RegistrationFormStepWithoutDataResponseDto) },
        { $ref: getSchemaPath(RegistrationCompletedStepResponseDto) },
      ],
    },
  })
  checkAuthenticatedUser(
    @AuthenticatedUser() user: RequestHydratedUser,
    @Query("withFormData") withFormData?: boolean = false,
  ): Promise<RegistrationFormStep | RegistrationCompletedStep> {
    return this.registrationService.checkAuthenticatedUser(user, withFormData);
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
    @Body()
    { newcomer, token }: RegistrationRequestDto,
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
