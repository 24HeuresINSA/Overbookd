import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
  ApiExtraModels,
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA, VALIDATE_FA, WRITE_FA } from "@overbookd/permission";
import type {
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PreviewFestivalActivity,
  Refused,
  TimeWindow,
} from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { RequestWithUserPayload } from "../app.controller";
import { CreateFestivalActivityRequestDto } from "./dto/create-festival-activity.request.dto";
import { DraftFestivalActivityResponseDto } from "./common/dto/draft/draft-festival-activity.response.dto";
import {
  AddElectricitySupplyRequestDto,
  AddFeedbackRequestDto,
  AddInquiryRequestDto,
  InitInquiryRequestDto,
  LinkInquiryDriveRequestDto,
  SupplyRequestDto,
  UpdateElectricitySupplyRequestDto,
} from "./dto/update-festival-activity.request.dto";
import {
  DraftPreviewFestivalActivityResponseDto,
  InReviewPreviewFestivalActivityResponseDto,
  PreviewForCommunicationResponseDto,
  PreviewForSecuResponseDto,
  RefusedPreviewFestivalActivityResponseDto,
  ValidatedPreviewFestivalActivityResponseDto,
} from "./dto/preview-festival-activity.response.dto";
import { PeriodDto } from "./common/dto/period.dto";
import { FestivalActivityErrorFilter } from "./common/festival-activity-error.filter";
import { RefusedFestivalActivityResponseDto } from "./common/dto/reviewable/reviewable-festival-activity.dto";
import { ValidatedFestivalActivityResponseDto } from "./common/dto/reviewable/reviewable-festival-activity.dto";
import { InReviewFestivalActivityResponseDto } from "./common/dto/reviewable/reviewable-festival-activity.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "./common/dto/inquiry-request.response.dto";
import {
  PrivateReviewableGeneralResponseDto,
  PublicReviewableGeneralResponseDto,
} from "./common/dto/reviewable/reviewable-general.response.dto";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { ApproveRequestDto, RejectRequestDto } from "./dto/review.request.dto";
import { LinkedSignageResponseDto } from "./common/dto/signage.response.dto";
import { UnlinkedSignageResponseDto } from "./common/dto/signage.response.dto";
import { StatisticsService } from "../statistics/statistics.service";
import {
  PreviewForCommunication,
  PreviewForSecu,
  Statistics,
} from "@overbookd/http";
import { StatisticsResponseDto } from "../statistics/dto/statistics.response.dto";

@ApiBearerAuth()
@ApiTags("festival-activities")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftPreviewFestivalActivityResponseDto,
  InReviewPreviewFestivalActivityResponseDto,
  ValidatedPreviewFestivalActivityResponseDto,
  RefusedPreviewFestivalActivityResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-activities")
export class FestivalActivityController {
  constructor(
    private readonly festivalActivityService: FestivalActivityService,
    private readonly statistics: StatisticsService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedPreviewFestivalActivityResponseDto) },
      ],
    },
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivityService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("for-security")
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewForSecuResponseDto,
    isArray: true,
  })
  findAllForSecurity(): Promise<PreviewForSecu[]> {
    return this.festivalActivityService.findForSecurity();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("for-communication")
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewForCommunicationResponseDto,
    isArray: true,
  })
  findAllForCommunication(): Promise<PreviewForCommunication[]> {
    return this.festivalActivityService.findForCommunication();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("statistics")
  @ApiResponse({
    status: 200,
    description: "Festival activities statistics",
    isArray: true,
    type: StatisticsResponseDto,
  })
  displayStatistics(): Promise<Statistics[]> {
    return this.statistics.festivalActivity;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id")
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
  ): Promise<FestivalActivity | null> {
    return this.festivalActivityService.findById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post()
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
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.create(user, name);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/ask-for-review")
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
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  askForReview(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.toReview(id, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":id")
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
    return this.festivalActivityService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/supply")
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
    description: "Supply section of festival activity to save",
    type: SupplyRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSupplySection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() supply: SupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.saveSupplySection(id, supply);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/supply/electricity")
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
      "Electricity supply to add in supply section of festival activity",
    type: AddElectricitySupplyRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addElectricitySupply(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() electricitySupply: AddElectricitySupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addElectricitySupply(
      id,
      electricitySupply,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":faId/supply/electricity/:electricitySupplyId")
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
      "Electricity supply data to update in supply section of festival activity",
    type: UpdateElectricitySupplyRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "electricitySupplyId",
    type: String,
    description: "Electricity supply id",
    required: true,
  })
  updateElectricitySupply(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("electricitySupplyId")
    electricitySupplyId: ElectricitySupply["id"],
    @Body() electricitySupply: UpdateElectricitySupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.updateElectricitySupply(
      faId,
      electricitySupplyId,
      electricitySupply,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/supply/electricity/:electricitySupplyId")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
    name: "electricitySupplyId",
    type: String,
    description: "Electricity supply id",
    required: true,
  })
  removeElectricitySupply(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("electricitySupplyId", ParseIntPipe)
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeElectricitySupply(
      faId,
      electricitySupplyId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
    description: "Inquiry section initial request",
    type: InitInquiryRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  initInquiry(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() inquiryInitializer: InitInquiryRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.initInquiry(faId, inquiryInitializer);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry/time-windows")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
    description: "Time window to add in inquiry section of festival activity",
    type: PeriodDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() timeWindow: PeriodDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addInquiryTimeWindow(faId, timeWindow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/inquiry/time-windows/:timeWindowId")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
  removeInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeInquiryTimeWindow(
      faId,
      timeWindowId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry/requests")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
      "Inquiry request to add in inquiry section of festival activity",
    type: AddInquiryRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() inquiryRequest: AddInquiryRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addInquiryRequest(faId, inquiryRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/inquiry/requests/:inquirySlug")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  removeInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeInquiryRequest(faId, slug);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Patch(":faId/inquiry/requests/:inquirySlug")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
      "Drive to link inquiry request with in inquiry section of festival activity",
    type: LinkInquiryDriveRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  linkInquiryRequestToDrive(
    @Param("faId", ParseIntPipe) activityId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
    @Body() { drive }: LinkInquiryDriveRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.linkInquiryRequestToDrive(jwt, {
      activityId,
      slug,
      drive,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/feedbacks")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
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
    description: "Feedback to add to festival activity",
    type: AddFeedbackRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addFeedback(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() feedback: AddFeedbackRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addFeedback(faId, user, feedback);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Post(":faId/approve")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Festival activity approval",
    type: ApproveRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  approve(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() { team }: ApproveRequestDto,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.approve(faId, jwt, team);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Post(":faId/reject")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    type: RefusedFestivalActivityResponseDto,
  })
  @ApiBody({
    description: "Festival activity rejection",
    type: RejectRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  reject(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() reject: RejectRequestDto,
  ): Promise<Refused> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.reject(faId, jwt, reject);
  }
}
