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
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { ContributionService } from "./contribution.service";
import { PayContributionRequestDto } from "./dto/pay-contribution.request.dto";
import { Adherent, AdherentWithContribution } from "@overbookd/contribution";
import { Permission } from "../authentication/permissions-auth.decorator";
import { MANAGE_CONTRIBUTIONS } from "@overbookd/permission";
import { ContributionAdherentResponseDto } from "./dto/adherent.response.dto";
import { ContributionErrorFilter } from "./contribution.filter";
import { EditAmountRequestDto } from "./dto/edit-amount.request.dto";
import { AdherentWithContributionResponseDto } from "./dto/adherent-with-contribution.response.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("contributions")
@ApiTags("contributions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(ContributionErrorFilter)
@ApiSwaggerResponse()
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Get("out-to-date-adherents")
  @Permission(MANAGE_CONTRIBUTIONS)
  @ApiResponse({
    status: 200,
    description:
      "List of adherents with contribution out-to-date for the current edition",
    type: ContributionAdherentResponseDto,
    isArray: true,
  })
  findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.contributionService.findAdherentsWithContributionOutToDate();
  }

  @Get("valid-adherents")
  @Permission(MANAGE_CONTRIBUTIONS)
  @ApiResponse({
    status: 200,
    description:
      "List of adherents with valid contribution for the current edition",
    type: AdherentWithContributionResponseDto,
    isArray: true,
  })
  findAdherentsWithValidContribution(): Promise<AdherentWithContribution[]> {
    return this.contributionService.findAdherentsWithValidContribution();
  }

  @Post()
  @Permission(MANAGE_CONTRIBUTIONS)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Pay contribution",
  })
  @ApiBody({
    description: "Contribution to pay",
    type: PayContributionRequestDto,
  })
  pay(@Body() contributionData: PayContributionRequestDto): Promise<void> {
    return this.contributionService.pay(contributionData);
  }

  @Patch("adherents/:adherentId/editions/:edition")
  @Permission(MANAGE_CONTRIBUTIONS)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
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

  @Delete("adherents/:adherentId/editions/:edition")
  @Permission(MANAGE_CONTRIBUTIONS)
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
