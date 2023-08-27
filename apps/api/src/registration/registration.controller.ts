import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RegistrationRequestDto } from "./dto/registration.request.dto";
import { RegistrationService } from "./registration.service";
import { RegistrationErrorFilter } from "./registration-error.filter";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { IDefineANewcomer, TeamCode } from "@overbookd/registration";
import { NewcomerResponseDto } from "./dto/newcomer.response.dto";
import { EnrollNewcomerRequestDto } from "./dto/enroll-newcomer.request.dto";

@ApiBearerAuth()
@ApiTags("registration")
@Controller("newcomers")
@ApiBadRequestResponse({
  description: "Bad Request",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseFilters(new RegistrationErrorFilter())
  @ApiBody({
    description: "Register a newcomer",
    type: RegistrationRequestDto,
  })
  @HttpCode(201)
  registerNewcomer(@Body() { newcomer, token }: RegistrationRequestDto) {
    return this.registrationService.register(newcomer, token);
  }

  @Get("invite-new-adherents-link")
  @HttpCode(200)
  generateNewAdherentsInvitationLink() {
    return this.registrationService.invite();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission("manage-users")
  @Get("/newcomers")
  @ApiResponse({
    status: 200,
    description: "Get all newcomers",
    type: NewcomerResponseDto,
    isArray: true,
  })
  getNewcomers(): Promise<IDefineANewcomer[]> {
    return this.registrationService.getNewcomers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission("manage-users")
  @Post("/newcomers/enroll-to/:team")
  @HttpCode(204)
  @ApiBody({
    description: "Newcomers to enroll",
    type: EnrollNewcomerRequestDto,
    isArray: true,
  })
  @ApiResponse({
    status: 204,
    description: "Enroll newcomers to a team",
  })
  enrollNewcomers(
    @Param("team") team: TeamCode,
    @Body() newcomers: EnrollNewcomerRequestDto[],
  ): Promise<void> {
    return this.registrationService.enrollNewcomers(team, newcomers);
  }
}
