import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { FestivalActivity, Refused } from "@overbookd/festival-event";
import { VALIDATE_FA, WRITE_FA } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import { RequestWithUserPayload } from "../../../app.controller";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../../common/dto/inquiry-request.response.dto";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { DraftFestivalActivityResponseDto } from "../common/dto/draft/draft-festival-activity.response.dto";
import {
  InReviewFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
} from "../common/dto/reviewable/reviewable-festival-activity.dto";
import {
  PrivateReviewableGeneralResponseDto,
  PublicReviewableGeneralResponseDto,
} from "../common/dto/reviewable/reviewable-general.response.dto";
import {
  LinkedSignageResponseDto,
  UnlinkedSignageResponseDto,
} from "../common/dto/signage.response.dto";
import { FestivalActivityErrorFilter } from "../common/festival-activity-error.filter";
import { AddFeedbackRequestDto } from "./dto/add-feedback.request.dto";
import {
  ApproveActivityRequestDto,
  RejectActivityRequestDto,
} from "./dto/review.request.dto";
import { FestivalActivityReviewService } from "./festival-activity-review.service";

@Controller("festival-activities")
@ApiTags("festival-activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
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
export class FestivalActivityReviewController {
  constructor(private readonly reviewService: FestivalActivityReviewService) {}

  @Post(":faId/feedbacks")
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
    return this.reviewService.addFeedback(faId, user, feedback);
  }

  @Post(":faId/ask-for-review")
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
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  askForReview(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    return this.reviewService.toReview(faId, user);
  }

  @Post(":faId/approve")
  @Permission(VALIDATE_FA)
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
    type: ApproveActivityRequestDto,
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
    @Body() { team }: ApproveActivityRequestDto,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.reviewService.approve(faId, jwt, team);
  }

  @Post(":faId/reject")
  @Permission(VALIDATE_FA)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    type: RefusedFestivalActivityResponseDto,
  })
  @ApiBody({
    description: "Festival activity rejection",
    type: RejectActivityRequestDto,
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
    @Body() reject: RejectActivityRequestDto,
  ): Promise<Refused> {
    const jwt = new JwtUtil(user);
    return this.reviewService.reject(faId, jwt, reject);
  }
}
