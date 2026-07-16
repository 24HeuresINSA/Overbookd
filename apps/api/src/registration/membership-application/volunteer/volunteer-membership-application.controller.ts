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
import { HasApplication, VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { HasApplicationResponseDto } from "../common/dto/has-application.response.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import { AuthenticatedUser } from "../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

@Controller("registrations/membership-applications/volunteers")
@ApiTags("registrations/membership-applications/volunteers")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class VolunteerMembershipApplicationController {
  constructor(
    private readonly applicationService: VolunteerMembershipApplicationService,
  ) {}

  @Post("apply")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer application submitted",
  })
  applyFor(@AuthenticatedUser() { email }: RequestHydratedUser): Promise<void> {
    return this.applicationService.applyFor(email);
  }

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

  @Get("me")
  @ApiResponse({
    status: 200,
    description: "Get current volunteer application",
    type: HasApplicationResponseDto,
  })
  getCurrentApplication(
    @AuthenticatedUser() { email }: RequestHydratedUser,
  ): Promise<HasApplication> {
    return this.applicationService.getCurrentApplication(email);
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
