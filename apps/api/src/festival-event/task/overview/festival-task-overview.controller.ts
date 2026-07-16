import {
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Controller,
  UseFilters,
  Delete,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
} from "@nestjs/swagger";
import { FestivalTask } from "@overbookd/festival-event";
import { READ_FT, WRITE_FT } from "@overbookd/permission";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { CreateFestivalTaskRequestDto } from "./dto/create-festival-task.request.dto";
import { DraftFestivalTaskResponseDto } from "../common/dto/draft/draft-festival-task.response.dto";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { FestivalTaskOverviewService } from "./festival-task-overview.service";
import { DraftGeneralResponseDto } from "../common/dto/draft/draft-general.response.dto";
import { DraftInstructionsResponseDto } from "../common/dto/draft/draft-instructions.response.dto";
import { ContactResponseDto } from "../common/dto/contact.response.dto";
import { FestivalActivityResponseDto } from "../common/dto/festival-activity.response.dto";
import { StatisticsService } from "../../statistics/statistics.service";
import { Statistics } from "@overbookd/http";
import { StatisticsResponseDto } from "../../statistics/dto/statistics.response.dto";
import { LocationResponseDto } from "../../common/dto/location.response.dto";
import { AdherentResponseDto } from "../../common/dto/adherent.response.dto";
import { TimeWindowResponseDto } from "../../common/dto/time-window.response.dto";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import {
  InReviewFestivalTaskResponseDto,
  ReadyToAssignFestivalTaskResponseDto,
  RefusedFestivalTaskResponseDto,
  ValidatedFestivalTaskResponseDto,
} from "../common/dto/reviewable/reviewable-festival-task.response.dto";
import {
  MobilizationAssignmentResponseDto,
  MobilizationWithAtLeastOneTeamAndAssignmentsDto,
  MobilizationWithAtLeastOneTeamDto,
  MobilizationWithAtLeastOneVolunteerAndAssignmentsDto,
  MobilizationWithAtLeastOneVolunteerDto,
} from "../common/dto/reviewable/reviewable-mobilization.response.dto";
import { VolunteerResponseDto } from "../../common/dto/volunteer.response.dto";
import {
  TaskInReviewReviewsResponseDto,
  TaskRefusedReviewsResponseDto,
  TaskValidatedReviewsResponseDto,
} from "../common/dto/reviewable/reviews.response.dto";
import { ReviewableInstructionsResponseDto } from "../common/dto/reviewable/reviewable-instructions.response.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../../common/dto/inquiry-request.response.dto";
import { AuthenticatedUser } from "../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
@ApiExtraModels(
  DraftFestivalTaskResponseDto,
  DraftGeneralResponseDto,
  DraftInstructionsResponseDto,
  AdherentResponseDto,
  LocationResponseDto,
  ContactResponseDto,
  FestivalActivityResponseDto,
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  TimeWindowResponseDto,
  ValidatedFestivalTaskResponseDto,
  ReadyToAssignFestivalTaskResponseDto,
  MobilizationWithAtLeastOneTeamAndAssignmentsDto,
  MobilizationWithAtLeastOneTeamDto,
  MobilizationWithAtLeastOneVolunteerAndAssignmentsDto,
  MobilizationWithAtLeastOneVolunteerDto,
  VolunteerResponseDto,
  TaskRefusedReviewsResponseDto,
  TaskValidatedReviewsResponseDto,
  TaskInReviewReviewsResponseDto,
  ReviewableInstructionsResponseDto,
  MobilizationAssignmentResponseDto,
)
export class FestivalTaskOverviewController {
  constructor(
    private readonly overviewService: FestivalTaskOverviewService,
    private readonly statistics: StatisticsService,
  ) {}

  @Get("statistics")
  @Permissions(READ_FT)
  @ApiResponse({
    status: 200,
    description: "Festival tasks statistics",
    isArray: true,
    type: StatisticsResponseDto<FestivalTask>,
  })
  displayStatistics(): Promise<Statistics<FestivalTask>[]> {
    return this.statistics.festivalTask;
  }

  @Get(":id")
  @Permissions(READ_FT)
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ReadyToAssignFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  findById(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
  ): Promise<FestivalTask | null> {
    return this.overviewService.findById(id);
  }

  @Get("my-refusals/count")
  @Permissions(READ_FT)
  @ApiResponse({
    status: 200,
    description: "Number of refused festival tasks for the user",
  })
  getMyRefusedTasksCount(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<number> {
    return this.statistics.countRefusedTasksByUser(user.id);
  }

  @Post()
  @Permissions(WRITE_FT)
  @ApiResponse({
    status: 201,
    description: "A festival task",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Festival task to create",
    type: CreateFestivalTaskRequestDto,
  })
  create(
    @Body() form: CreateFestivalTaskRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.overviewService.createOne(form, user.id);
  }

  @Delete(":id")
  @Permissions(WRITE_FT)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Festival task deleted",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: FestivalTask["id"]): Promise<void> {
    return this.overviewService.removeOne(id);
  }
}
