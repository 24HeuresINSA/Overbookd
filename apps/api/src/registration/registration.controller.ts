import {
  Body,
  Controller,
  Delete,
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
import {
  ForgetMemberErrorFilter,
  RegistrationErrorFilter,
} from "./registration-error.filter";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import {
  EnrollableAdherentResponseDto,
  EnrollableVolunteerResponseDto,
} from "./dto/newcomer.response.dto";
import { EnrollNewcomersRequestDto } from "./dto/enroll-newcomers.request.dto";
import { ENROLL_HARD, ENROLL_SOFT } from "@overbookd/permission";
import { ForgetRequestDto } from "./dto/forget.request.dto";
import { EnrollableAdherent } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("registration")
@Controller("registrations")
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
  @Permission(ENROLL_HARD)
  @Get("adherents")
  @ApiResponse({
    status: 200,
    description: "Get all adherents",
    type: EnrollableAdherentResponseDto,
    isArray: true,
  })
  getEnrollableAdherents(): Promise<EnrollableAdherent[]> {
    return this.registrationService.getAdherents();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Post("adherents/enroll")
  @ApiBody({
    description: "Adherents to enroll to a team",
    type: EnrollNewcomersRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "Enroll adherents to a team",
  })
  enrollAdherents(
    @Body() { newcomers }: EnrollNewcomersRequestDto,
  ): Promise<void> {
    return this.registrationService.enrollNewcomers({
      newcomers,
      team: "hard",
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_SOFT)
  @Get("volunteers")
  @ApiResponse({
    status: 200,
    description: "Get all volunteers",
    type: EnrollableVolunteerResponseDto,
    isArray: true,
  })
  getEnrollableVolunteers(): Promise<EnrollableVolunteerResponseDto[]> {
    return this.registrationService.getVolunteers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_SOFT)
  @Post("volunteers/enroll")
  @ApiBody({
    description: "Volunteer to enroll to a team",
    type: EnrollNewcomersRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "Enroll volunteer to a team",
  })
  enrollVolunteer(
    @Body() { newcomers }: EnrollNewcomersRequestDto,
  ): Promise<void> {
    return this.registrationService.enrollNewcomers({
      newcomers,
      team: "soft",
    });
  }

  @Post("forget")
  @UseFilters(new ForgetMemberErrorFilter())
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
  @UseFilters(new ForgetMemberErrorFilter())
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Forget request done",
  })
  forgetHim(@Param("email") email: string): Promise<void> {
    return this.registrationService.forgetHim(email);
  }
}
