import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
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
import { ENROLL_SOFT } from "@overbookd/permission";
import { HasApplication, VolunteerCandidate } from "@overbookd/http";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { HasApplicationResponseDto } from "../common/dto/has-application.response.dto";
import { PeriodRequestDto } from "../../../common/dto/period.request.dto";
import { VolunteerAvailabilityErrorFilter } from "../../../volunteer-availability/volunteer-availability-error.filter";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";

@Controller("registrations/membership-applications/volunteers")
@ApiTags("registrations/membership-applications/volunteers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(MembershipApplicationErrorFilter)
@ApiSwaggerResponse()
export class VolunteerMembershipApplicationController {
  constructor(
    private readonly applicationService: VolunteerMembershipApplicationService,
  ) {}

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
  applyFor(@Param("email") email: string): Promise<void> {
    return this.applicationService.applyFor(email);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
  @ApiResponse({
    status: 200,
    description: "Get all volunteer candidates",
    type: VolunteerCandidateResponseDto,
    isArray: true,
  })
  getCandidates(): Promise<VolunteerCandidate[]> {
    return this.applicationService.getCandidates();
  }

  @Get("candidates/count")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
  @ApiResponse({
    status: 200,
    description: "Get the volunteer candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @Get("rejected")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
  @ApiResponse({
    status: 200,
    description: "Get all rejected volunteer candidates",
    type: VolunteerCandidateResponseDto,
    isArray: true,
  })
  getRejectedCandidates(): Promise<VolunteerCandidate[]> {
    return this.applicationService.getRejectedCandidates();
  }

  @Post("enroll")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
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

  @Get(":email")
  @ApiParam({
    name: "email",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Get current volunteer application",
    type: HasApplicationResponseDto,
  })
  getCurrentApplication(
    @Param("email") email: string,
  ): Promise<HasApplication> {
    return this.applicationService.getCurrentApplication(email);
  }

  @Delete(":candidateId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
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

  @Post(":candidateId/cancel-rejection")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
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

  @Post("briefing-time-window")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_SOFT)
  @UseFilters(VolunteerAvailabilityErrorFilter)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Upsert briefing time window",
  })
  @ApiBody({
    description: "Briefing time window",
    type: PeriodRequestDto,
  })
  upsertBriefingTimeWindow(@Body() period: PeriodRequestDto): Promise<void> {
    return this.applicationService.upsertBriefingTimeWindow(period);
  }
}
