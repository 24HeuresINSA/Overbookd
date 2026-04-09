import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { ForgetRequestDto } from "./dto/forget.request.dto";
import { RegistrationRequestDto } from "./dto/registration.request.dto";
import {
  ForgetMemberErrorFilter,
  RegistrationErrorFilter,
} from "./registration-error.filter";
import { RegistrationService } from "./registration.service";

@Controller("registrations")
@ApiTags("registration")
@ApiSwaggerResponse()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
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
