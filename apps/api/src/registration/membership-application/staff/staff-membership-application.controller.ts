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
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { ENROLL_HARD } from "@overbookd/permission";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { StaffCandidateResponseDto } from "./dto/staff-candidate.response.dto";
import { StaffCandidateRequestDto } from "./dto/staff-candidate.request.dto";
import { HasApplicationResponseDto } from "../common/dto/has-application.response.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";

@Controller("registrations/membership-applications/staffs")
@ApiTags("registrations/membership-applications/staffs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(MembershipApplicationErrorFilter)
@ApiSwaggerResponse()
export class StaffMembershipApplicationController {
  constructor(
    private readonly applicationService: StaffMembershipApplicationService,
  ) {}

  @Post()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff application submitted",
  })
  @ApiBody({
    type: StaffCandidateRequestDto,
    description: "Candidate",
  })
  applyFor(@Body() { email, token }: StaffCandidateRequestDto): Promise<void> {
    return this.applicationService.applyFor(email, token);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
  @ApiResponse({
    status: 200,
    description: "Get the staff candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @Get("rejected")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
  getStaffInvitationLink(): Promise<URL | undefined> {
    return this.applicationService.getStaffInvitationLink();
  }

  @Post("invitation-link")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
  generateStaffInvitationLink(): Promise<URL> {
    return this.applicationService.generateStaffInvitationLink();
  }

  @Get(":email")
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "email",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Get current staff application",
    type: HasApplicationResponseDto,
  })
  getCurrentApplication(
    @Param("email") email: string,
  ): Promise<HasApplication> {
    return this.applicationService.getCurrentApplication(email);
  }

  @Delete(":candidateId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ENROLL_HARD)
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
