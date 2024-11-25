import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { MembershipApplicationErrorFilter } from "../common/membership-application-error.filter";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { VolunteerCandidateResponseDto } from "./dto/volunteer-candidate.response";
import { ENROLL_FESTIVAL_VOLUNTEER } from "@overbookd/permission";
import { VolunteerCandidate } from "@overbookd/http";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";

@ApiBearerAuth()
@ApiTags("registrations/membership-applications/volunteers")
@Controller("registrations/membership-applications/volunteers")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class VolunteerMembershipApplicationController {
  constructor(
    private readonly applicationService: VolunteerMembershipApplicationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("apply/:email")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer application submitted",
  })
  @ApiParam({
    name: "email",
    type: String,
  })
  submitApplication(@Param("email") email: string): Promise<void> {
    return this.applicationService.applyFor(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all volunteer candidates",
    type: VolunteerCandidateResponseDto,
    isArray: true,
  })
  getCandidates(): Promise<VolunteerCandidate[]> {
    return this.applicationService.getCandidates();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Get("candidates/count")
  @ApiResponse({
    status: 200,
    description: "Get the volunteer candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Get("rejected")
  @ApiResponse({
    status: 200,
    description: "Get all rejected volunteer candidates",
    type: VolunteerCandidateResponseDto,
    isArray: true,
  })
  getRejectedCandidates(): Promise<VolunteerCandidate[]> {
    return this.applicationService.getRejectedCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Post("enroll")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer candidates enrolled",
  })
  @ApiBody({
    description: "Volunteer candidates to enroll",
    type: EnrollCandidatesRequestDto,
    isArray: true,
  })
  enroll(@Body() { candidates }: EnrollCandidatesRequestDto): Promise<void> {
    return this.applicationService.enroll(candidates);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Delete(":candidateId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer application rejected",
  })
  @ApiParam({
    name: "candidateId",
    type: Number,
  })
  rejectVolunteerApplication(
    @Param("candidateId", ParseIntPipe) candidateId: number,
  ): Promise<void> {
    return this.applicationService.rejectVolunteerApplication(candidateId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_FESTIVAL_VOLUNTEER)
  @Post(":candidateId/cancel-rejection")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer application rejection canceled",
  })
  @ApiParam({
    name: "candidateId",
    type: Number,
  })
  cancelVolunteerApplicationRejection(
    @Param("candidateId", ParseIntPipe) candidateId: number,
  ): Promise<void> {
    return this.applicationService.cancelVolunteerApplicationRejection(
      candidateId,
    );
  }
}
