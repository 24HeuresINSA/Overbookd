import {
  Body,
  Controller,
  Delete,
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
import { MembershipApplicationService } from "./membership-application.service";
import { MembershipApplicationErrorFilter } from "./membership-application-error.filter";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { CandidateRequestDto } from "./dto/candidate.request.dto";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { ENROLL_HARD } from "@overbookd/permission";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";

@ApiBearerAuth()
@ApiTags("registrations/membership-applications")
@Controller("registrations/membership-applications")
@UseFilters(MembershipApplicationErrorFilter)
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class MembershipApplicationController {
  constructor(
    private readonly applicationService: MembershipApplicationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("staff")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Staff application",
  })
  @ApiBody({
    type: CandidateRequestDto,
    description: "Candidate",
  })
  applyAsStaff(@Body() { email, token }: CandidateRequestDto): Promise<void> {
    return this.applicationService.applyAsStaff(email, token);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_HARD)
  @Delete("staff/:candidateId")
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
}
