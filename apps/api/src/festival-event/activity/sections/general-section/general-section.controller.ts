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
  ApiExtraModels,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-event";
import { WRITE_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalActivityResponseDto } from "../../common/dto/draft/draft-festival-activity.response.dto";
import { PeriodRequestDto } from "../../../../common/dto/period.request.dto";
import { RefusedFestivalActivityResponseDto } from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import { ValidatedFestivalActivityResponseDto } from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import { InReviewFestivalActivityResponseDto } from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import {
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
} from "../../common/dto/reviewable/reviewable-general.response.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { GeneralRequestDto } from "./dto/update-general.request.dto";
import { GeneralSectionService } from "./general-section.service";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";

@Controller("festival-activities")
@ApiTags("festival-activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}

  @Patch(":id/general")
  @Permission(WRITE_FA)
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

  @Post(":id/general/time-windows")
  @Permission(WRITE_FA)
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
    type: PeriodRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addGeneralTimeWindow(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() timeWindow: PeriodRequestDto,
  ): Promise<FestivalActivity> {
    return this.generalService.addGeneralTimeWindow(id, timeWindow);
  }

  @Patch(":faId/general/time-windows/:timeWindowId")
  @Permission(WRITE_FA)
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
    description:
      "Time window to modify in general section of festival activity",
    type: PeriodRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  updateGeneralTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
    @Body() period: PeriodRequestDto,
  ): Promise<FestivalActivity> {
    return this.generalService.updateGeneralTimeWindow(
      faId,
      timeWindowId,
      period,
    );
  }

  @Delete(":faId/general/time-windows/:timeWindowId")
  @Permission(WRITE_FA)
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
