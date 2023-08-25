import { ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseFilters,
} from "@nestjs/common";
import { FulfilledRegistrationDto } from "./dto/fulfilled-registration.dto";
import { RegistrationService } from "./registration.service";
import { RegistrationErrorFilter } from "./registration-error.filter";

@ApiTags("registration")
@Controller("newcomers")
@ApiBadRequestResponse({
  description: "Bad Request",
})
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseFilters(new RegistrationErrorFilter())
  @ApiBody({
    description: "Register a newcomer",
    type: FulfilledRegistrationDto,
  })
  @HttpCode(201)
  registerNewcomer(@Body() registration: FulfilledRegistrationDto) {
    return this.registrationService.register(registration);
  }
}
