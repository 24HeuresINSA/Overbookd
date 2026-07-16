import {
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  HttpCode,
  Controller,
  UseFilters,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { Statistics } from "@overbookd/http";
import { FestivalActivity } from "@overbookd/festival-event";
import { READ_FA, WRITE_FA } from "@overbookd/permission";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { StatisticsResponseDto } from "../../statistics/dto/statistics.response.dto";
import { StatisticsService } from "../../statistics/statistics.service";
import { DraftFestivalActivityResponseDto } from "../common/dto/draft/draft-festival-activity.response.dto";
import {
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
} from "../common/dto/reviewable/reviewable-festival-activity.dto";
import {
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
} from "../common/dto/reviewable/reviewable-general.response.dto";
import {
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
} from "../common/dto/signage.response.dto";
import { CreateFestivalActivityRequestDto } from "./dto/create-festival-activity.request.dto";
import { FestivalActivityOverviewService } from "./festival-activity-overview.service";
import { FestivalActivityErrorFilter } from "../common/festival-activity-error.filter";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../../common/dto/inquiry-request.response.dto";
import { AuthenticatedUser } from "../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

@Controller("festival-activities")
@ApiTags("festival-activities")
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
@ApiExtraModels(
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
export class FestivalActivityOverviewController {
  constructor(
    private readonly overviewService: FestivalActivityOverviewService,
    private readonly statistics: StatisticsService,
  ) {}

  @Get("statistics")
  @Permissions(READ_FA)
  @ApiResponse({
    status: 200,
    description: "Festival activities statistics",
    isArray: true,
    type: StatisticsResponseDto,
  })
  displayStatistics(): Promise<Statistics[]> {
    return this.statistics.festivalActivity;
  }

  @Get(":id")
  @Permissions(READ_FA)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  findById(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
  ): Promise<FestivalActivity> {
    return this.overviewService.findById(id);
  }

  @Get("my-refusals/count")
  @Permissions(READ_FA)
  @ApiResponse({
    status: 200,
    description: "Number of refused festival activities for the user",
  })
  getMyRefusedActivitiesCount(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<number> {
    return this.statistics.countRefusedActivitiesByUser(user.id);
  }

  @Post()
  @Permissions(WRITE_FA)
  @ApiResponse({
    status: 201,
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
    description: "Festival activity to create",
    type: CreateFestivalActivityRequestDto,
  })
  create(
    @Body() { name }: CreateFestivalActivityRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalActivity> {
    return this.overviewService.create(name, user.id);
  }

  @Delete(":id")
  @Permissions(WRITE_FA)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Festival activity deleted",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: FestivalActivity["id"]): Promise<void> {
    return this.overviewService.remove(id);
  }
}
