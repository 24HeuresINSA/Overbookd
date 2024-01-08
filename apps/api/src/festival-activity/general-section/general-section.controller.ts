import {
  UseFilters,
  Controller,
  Body,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { DraftFestivalActivityResponseDto } from "../common/dto/draft/draft-festival-activity.response.dto";
import { RefusedFestivalActivityResponseDto } from "../common/dto/reviewable/reviewable-festival-activity.dto";
import { ValidatedFestivalActivityResponseDto } from "../common/dto/reviewable/reviewable-festival-activity.dto";
import { InReviewFestivalActivityResponseDto } from "../common/dto/reviewable/reviewable-festival-activity.dto";
import {
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
} from "../common/dto/reviewable/reviewable-general.response.dto";
import { FestivalActivityErrorFilter } from "../festival-activity-error.filter";
import { GeneralSectionService } from "./general-section.service";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-activity";
import { WRITE_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { PeriodDto } from "../common/dto/period.dto";
import { GeneralRequestDto } from "./dto/update-general.request.dto";
import { Permission } from "../../authentication/permissions-auth.decorator";

@ApiBearerAuth()
@ApiTags("festival-activities")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-activities")
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/general")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "General section of festival activity to save",
    type: GeneralRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveGeneralSection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() general: GeneralRequestDto,
  ): Promise<FestivalActivity> {
    return this.generalService.saveGeneralSection(id, general);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/general/time-windows")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Time window to add in general section of festival activity",
    type: PeriodDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addGeneralTimeWindow(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() timeWindow: PeriodDto,
  ): Promise<FestivalActivity> {
    return this.generalService.addGeneralTimeWindow(id, timeWindow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/general/time-windows/:timeWindowId")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "timeWindowId",
    type: String,
    description: "Time Window id",
    required: true,
  })
  removeGeneralTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.generalService.removeGeneralTimeWindow(faId, timeWindowId);
  }
}
