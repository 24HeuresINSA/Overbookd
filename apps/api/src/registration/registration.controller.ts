import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
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
import { IDefineANewcomer } from "@overbookd/registration";
import { NewcomerResponseDto } from "./dto/newcomer.response.dto";
import { EnrollNewcomersRequestDto } from "./dto/enroll-newcomers.request.dto";
import { ENROLL_NEWCOMER, MANAGE_USERS } from "@overbookd/permission";
import { ForgetRequestDto } from "./dto/forget.request.dto";

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
  @Permission(MANAGE_USERS)
  @Get()
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
  @Permission(ENROLL_NEWCOMER)
  @Post("/enroll")
  @ApiBody({
    description: "Newcomers to enroll to a team",
    type: EnrollNewcomersRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "Enroll newcomers to a team",
  })
  enrollNewcomers(@Body() payload: EnrollNewcomersRequestDto): Promise<void> {
    return this.registrationService.enrollNewcomers(payload);
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
  forgetMember(@Body() { token, credentials }: ForgetRequestDto) {
    return this.registrationService.forget(credentials, token);
  }
}
