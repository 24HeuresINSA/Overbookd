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
import { StaffCandidate } from "@overbookd/http";
import { MembershipApplicationErrorFilter } from "../common/membership-application-error.filter";
import { StaffMembershipApplicationService } from "./staff-membership-application.service";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { ENROLL_HARD } from "@overbookd/permission";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { EnrollCandidatesRequestDto } from "../common/dto/enroll-candidates.request.dto";
import { StaffCandidateResponseDto } from "./dto/staff-candidate.response.dto";
import { CandidateRequestDto } from "../common/dto/candidate.request.dto";

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
    description: "Staff application",
  })
  @ApiBody({
    type: CandidateRequestDto,
    description: "Candidate",
  })
  applyFor(@Body() { email, token }: CandidateRequestDto): Promise<void> {
    return this.applicationService.applyFor(email, token);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all staffs",
    type: StaffCandidateResponseDto,
    isArray: true,
  })
  getCandidates(): Promise<StaffCandidate[]> {
    return this.applicationService.getCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Get("unenrolled/count")
  @ApiResponse({
    status: 200,
    description: "Get the count of unenrolled staffs",
  })
  countCandidates(): Promise<number> {
    return this.applicationService.countCandidates();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Post("enroll")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff enrolled to a team",
  })
  @ApiBody({
    description: "Staffs to enroll to a team",
    type: EnrollCandidatesRequestDto,
  })
  enroll(@Body() { candidates }: EnrollCandidatesRequestDto): Promise<void> {
    return this.applicationService.enroll(candidates);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Delete(":candidateId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Reject staff application",
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
}
