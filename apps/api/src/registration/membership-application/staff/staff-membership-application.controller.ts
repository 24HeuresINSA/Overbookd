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
import { HasApplication, StaffCandidate } from "@overbookd/http";
import { MembershipApplicationErrorFilter } from "../common/membership-application-error.filter";
import { StaffMembershipApplicationService } from "./staff-membership-application.service";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { ENROLL_HARD } from "@overbookd/permission";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { StaffCandidateResponseDto } from "./dto/staff-candidate.response.dto";
import { StaffCandidateTokenRequestDto } from "./dto/staff-candidate-token.request.dto";
import { HasApplicationResponseDto } from "../common/dto/has-application.response.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import { AuthenticatedUser } from "../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

@Controller("registrations/membership-applications/staffs")
@ApiTags("registrations/membership-applications/staffs")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class StaffMembershipApplicationController {
  constructor(
    private readonly applicationService: StaffMembershipApplicationService,
  ) {}

  @Post("apply")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff application submitted",
  })
  @ApiBody({
    type: StaffCandidateTokenRequestDto,
    description: "Candidate",
  })
  applyFor(
    @Body() { token }: StaffCandidateTokenRequestDto,
    @AuthenticatedUser() { email }: RequestHydratedUser,
  ): Promise<void> {
    return this.applicationService.applyFor(email, token);
  }

  @Get()
  @Permissions(ENROLL_HARD)
  @ApiResponse({
    status: 200,
    description: "Get all staff candidates",
    type: StaffCandidateResponseDto,
    isArray: true,
  })
  getCandidates(): Promise<StaffCandidate[]> {
    return this.applicationService.getCandidates();
  }

  @Get("candidates/count")
  @Permissions(ENROLL_HARD)
  @ApiResponse({
    status: 200,
    description: "Get the staff candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @Get("rejected")
  @Permissions(ENROLL_HARD)
  @ApiResponse({
    status: 200,
    description: "Get all rejected staff candidates",
    type: StaffCandidateResponseDto,
    isArray: true,
  })
  getRejectedCandidates(): Promise<StaffCandidate[]> {
    return this.applicationService.getRejectedCandidates();
  }

  @Post("enroll")
  @Permissions(ENROLL_HARD)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff candidates enrolled",
  })
  @ApiBody({
    description: "Staffs candidates to enroll",
    type: EnrollCandidatesRequestDto,
  })
  enroll(@Body() { candidates }: EnrollCandidatesRequestDto): Promise<void> {
    return this.applicationService.enroll(candidates);
  }

  @Get("invitation-link")
  @Permissions(ENROLL_HARD)
  getStaffInvitationLink(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<URL | undefined> {
    return this.applicationService.getStaffInvitationLink(user);
  }

  @Post("invitation-link")
  @Permissions(ENROLL_HARD)
  generateStaffInvitationLink(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<URL> {
    return this.applicationService.generateStaffInvitationLink(user);
  }

  @Get("me")
  @ApiResponse({
    status: 200,
    description: "Get current staff application",
    type: HasApplicationResponseDto,
  })
  getCurrentApplication(
    @AuthenticatedUser() { email }: RequestHydratedUser,
  ): Promise<HasApplication> {
    return this.applicationService.getCurrentApplication(email);
  }

  @Delete(":candidateId")
  @Permissions(ENROLL_HARD)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff application rejected",
  })
  @ApiParam({
    name: "candidateId",
    type: Number,
  })
  rejectStaffApplication(
    @Param("candidateId", ParseIntPipe) candidateId: number,
  ): Promise<void> {
    return this.applicationService.rejectStaffApplication(candidateId);
  }

  @Post(":candidateId/cancel-rejection")
  @Permissions(ENROLL_HARD)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff application rejection canceled",
  })
  @ApiParam({
    name: "candidateId",
    type: Number,
  })
  cancelStaffApplicationRejection(
    @Param("candidateId", ParseIntPipe) candidateId: number,
  ): Promise<void> {
    return this.applicationService.cancelStaffApplicationRejection(candidateId);
  }
}
