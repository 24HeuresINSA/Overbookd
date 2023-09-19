import {
  UseGuards,
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { ContributionService } from "./contribution.service";
import { ContributionResponseDto } from "./dto/contribution.response.dto";
import { PayContributionRequestDto } from "./dto/pay-contribution.request.dto";
import { UserContribution, PayContributionForm } from "@overbookd/contribution";
import { Permission } from "../authentication/permissions-auth.decorator";
import { MANAGE_PERSONNAL_ACCOUNTS } from "@overbookd/permission";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags("contribution")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("contribution")
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_PERSONNAL_ACCOUNTS)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Pay configuration",
    type: ContributionResponseDto,
  })
  @ApiBody({ type: PayContributionRequestDto })
  pay(
    @Body() contributionData: PayContributionForm,
  ): Promise<UserContribution> {
    return this.contributionService.pay(contributionData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_PERSONNAL_ACCOUNTS)
  @Delete(":userId")
  @HttpCode(204)
  @ApiParam({ name: "userId", type: Number })
  remove(@Param("userId", ParseIntPipe) userId: number): Promise<void> {
    return this.contributionService.remove(userId);
  }
}
