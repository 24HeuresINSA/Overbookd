import {
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
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
import { PayContributionRequestDto } from "./dto/pay-contribution.request.dto";
import { Adherent } from "@overbookd/contribution";
import { Permission } from "../authentication/permissions-auth.decorator";
import { MANAGE_CONTRIBUTIONS } from "@overbookd/permission";
import { AdherentResponseDto } from "./dto/adherent.response.dto";
import { ContributionErrorFilter } from "./contribution.filter";
import { EditAmountRequestDto } from "./dto/edit-amount.request.dto";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags("contributions")
@UseFilters(ContributionErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("contributions")
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONTRIBUTIONS)
  @Get("out-to-date-adherents")
  @ApiResponse({
    status: 200,
    description:
      "List of adherents with contribution out-to-date for the current edition",
    type: AdherentResponseDto,
    isArray: true,
  })
  findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.contributionService.findAdherentsWithContributionOutToDate();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONTRIBUTIONS)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Pay contribution",
  })
  @ApiBody({
    description: "Contribution to pay",
    type: PayContributionRequestDto,
  })
  pay(@Body() contributionData: PayContributionRequestDto): Promise<void> {
    return this.contributionService.pay(contributionData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONTRIBUTIONS)
  @Patch("adherents/:adherentId/editions/:edition")
  @ApiResponse({
    status: 201,
    description: "Edit contribution",
  })
  @ApiParam({
    name: "adherentId",
    description: "Adherent id",
    type: Number,
  })
  @ApiParam({
    name: "edition",
    description: "Edition",
    type: Number,
  })
  @ApiBody({
    description: "Contribution with amount to edit",
    type: EditAmountRequestDto,
  })
  editAmount(
    @Param("adherentId", ParseIntPipe) adherentId: number,
    @Param("edition", ParseIntPipe) edition: number,
    @Body() { amount }: EditAmountRequestDto,
  ): Promise<void> {
    return this.contributionService.edit(adherentId, edition, amount);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONTRIBUTIONS)
  @Delete("adherents/:adherentId/editions/:edition")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove contribution",
  })
  @ApiParam({
    name: "adherentId",
    description: "Adherent id",
    type: Number,
  })
  @ApiParam({
    name: "edition",
    description: "Edition",
    type: Number,
  })
  remove(
    @Param("adherentId", ParseIntPipe) adherentId: number,
    @Param("edition", ParseIntPipe) edition: number,
  ): Promise<void> {
    return this.contributionService.remove(adherentId, edition);
  }
}
