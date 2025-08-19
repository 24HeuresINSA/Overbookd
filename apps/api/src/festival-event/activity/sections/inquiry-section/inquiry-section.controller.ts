import {
  UseFilters,
  Controller,
  Request,
  UseGuards,
  Post,
  HttpCode,
  Param,
  ParseIntPipe,
  Body,
  Delete,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import {
  FestivalActivity,
  InquiryRequest,
  TimeWindow,
} from "@overbookd/festival-event";
import { WRITE_FA, VALIDATE_FA } from "@overbookd/permission";
import { RequestWithUserPayload } from "../../../../app.controller";
import { JwtUtil } from "../../../../authentication/entities/jwt-util.entity";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalActivityResponseDto } from "../../common/dto/draft/draft-festival-activity.response.dto";
import { PeriodRequestDto } from "../../../../common/dto/period.request.dto";
import {
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { InitInquiryRequestDto } from "./dto/init-inquiry.request.dto";
import { LinkInquiryDriveRequestDto } from "../../../common/dto/link-inquiry-drive.request.dto";
import { InquirySectionService } from "./inquiry-section.service";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { AddInquiryRequestDto } from "../../../common/dto/add-inquiry-request.request.dto";
import { UpdateInquiryRequestDto } from "../../../common/dto/update-inquiry-request.request.dto";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../../../common/dto/inquiry-request.response.dto";

@Controller("festival-activities")
@ApiTags("festival-activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
export class InquirySectionController {
  constructor(private readonly inquiryService: InquirySectionService) {}

  @Post(":faId/inquiry")
  @Permission(WRITE_FA)
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
    return this.inquiryService.initInquiry(faId, inquiryInitializer);
  }

  @Delete(":faId/inquiry")
  @Permission(WRITE_FA)
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
  clearInquiry(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
  ): Promise<FestivalActivity> {
    return this.inquiryService.clearInquiry(faId);
  }

  @Post(":faId/inquiry/time-windows")
  @Permission(WRITE_FA)
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
    type: PeriodRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() timeWindow: PeriodRequestDto,
  ): Promise<FestivalActivity> {
    return this.inquiryService.addInquiryTimeWindow(faId, timeWindow);
  }

  @Patch(":faId/inquiry/time-windows/:timeWindowId")
  @Permission(WRITE_FA)
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
      "Time window to modify in inquiry section of festival activity",
    type: PeriodRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  updateInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
    @Body() period: PeriodRequestDto,
  ): Promise<FestivalActivity> {
    return this.inquiryService.updateInquiryTimeWindow(
      faId,
      timeWindowId,
      period,
    );
  }

  @Delete(":faId/inquiry/time-windows/:timeWindowId")
  @Permission(WRITE_FA)
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
    return this.inquiryService.removeInquiryTimeWindow(faId, timeWindowId);
  }

  @Post(":faId/inquiry/requests")
  @Permission(WRITE_FA)
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
    return this.inquiryService.addInquiryRequest(faId, inquiryRequest);
  }

  @Patch(":faId/inquiry/requests/:inquirySlug")
  @Permission(WRITE_FA)
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
      "Inquiry request quantity to update in inquiry section of festival activity",
    type: UpdateInquiryRequestDto,
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
  updateInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
    @Body() inquiryRequest: UpdateInquiryRequestDto,
  ): Promise<FestivalActivity> {
    return this.inquiryService.updateInquiryRequest(faId, slug, inquiryRequest);
  }

  @Delete(":faId/inquiry/requests/:inquirySlug")
  @Permission(WRITE_FA)
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
    return this.inquiryService.removeInquiryRequest(faId, slug);
  }

  @Patch(":faId/inquiry/requests/:inquirySlug/link-drive")
  @Permission(VALIDATE_FA)
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
    return this.inquiryService.linkInquiryRequestToDrive(jwt, {
      activityId,
      slug,
      drive,
    });
  }
}
