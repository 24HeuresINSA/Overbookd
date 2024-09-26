import {
  Body,
  Controller,
  HttpCode,
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
import { MembershipApplicationService } from "./membership-application.service";
import { MembershipApplicationErrorFilter } from "./membership-application-error.filter";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { CandidateRequestDto } from "./dto/candidate.request.dto";

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
  applyAsStaff(@Body() { email, token }: CandidateRequestDto): Promise<void> {
    return this.applicationService.applyAsStaff(email, token);
  }
}
