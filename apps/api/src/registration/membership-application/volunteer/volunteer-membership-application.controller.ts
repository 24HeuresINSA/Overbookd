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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MembershipApplicationErrorFilter } from "../common/membership-application-error.filter";
import { VolunteerMembershipApplicationService } from "./volunteer-membership-application.service";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { VolunteerCandidateResponseDto } from "./dto/volunteer-candidate.response";
import { ENROLL_SOFT } from "@overbookd/permission";
import { VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";

@Controller("registrations/membership-applications/volunteers")
@ApiTags("registrations/membership-applications/volunteers")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class VolunteerMembershipApplicationController {
  constructor(
    private readonly applicationService: VolunteerMembershipApplicationService,
  ) {}

  @Get()
  @Permissions(ENROLL_SOFT)
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
  @Permissions(ENROLL_SOFT)
  @ApiResponse({
    status: 200,
    description: "Get the volunteer candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @Get("rejected")
  @Permissions(ENROLL_SOFT)
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
  @Permissions(ENROLL_SOFT)
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

  @Delete(":candidateId")
  @Permissions(ENROLL_SOFT)
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
  @Permissions(ENROLL_SOFT)
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
