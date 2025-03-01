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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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

@ApiBearerAuth()
@ApiTags("registrations/membership-applications/staffs")
@Controller("registrations/membership-applications/staffs")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class StaffMembershipApplicationController {
  constructor(
    private readonly applicationService: StaffMembershipApplicationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all staff candidates",
    type: StaffCandidateResponseDto,
    isArray: true,
  })
  getCandidates(): Promise<StaffCandidate[]> {
    return this.applicationService.getCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get("candidates/count")
  @ApiResponse({
    status: 200,
    description: "Get the staff candidates count",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get("rejected")
  @ApiResponse({
    status: 200,
    description: "Get all rejected staff candidates",
    type: StaffCandidateResponseDto,
    isArray: true,
  })
  getRejectedCandidates(): Promise<StaffCandidate[]> {
    return this.applicationService.getRejectedCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Post("enroll")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get("invitation-link")
  getStaffInvitationLink(): Promise<URL | undefined> {
    return this.applicationService.getStaffInvitationLink();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Post("invitation-link")
  generateStaffInvitationLink(): Promise<URL> {
    return this.applicationService.generateStaffInvitationLink();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":email")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Delete(":candidateId")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Post(":candidateId/cancel-rejection")
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
