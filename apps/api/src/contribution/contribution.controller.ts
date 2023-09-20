import {
  UseGuards,
  Controller,
  Get,
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
import { MANAGE_CONTRIBUTIONS } from "@overbookd/permission";
import { UserPersonnalDataResponseDto } from "../user/dto/user-personnal-data.response.dto";
import { UserPersonnalData } from "@overbookd/user";

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
  @Permission(MANAGE_CONTRIBUTIONS)
  @Get()
  @ApiResponse({
    status: 200,
    description: "List of users with no contribution for the current edition",
    type: UserPersonnalDataResponseDto,
    isArray: true,
  })
  findUsersWithNoContribution(): Promise<UserPersonnalData[]> {
    return this.contributionService.findUsersWithNoContribution();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONTRIBUTIONS)
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
  @Permission(MANAGE_CONTRIBUTIONS)
  @Delete(":userId")
  @HttpCode(204)
  @ApiParam({ name: "userId", type: Number })
  remove(@Param("userId", ParseIntPipe) userId: number): Promise<void> {
    return this.contributionService.remove(userId);
  }
}
