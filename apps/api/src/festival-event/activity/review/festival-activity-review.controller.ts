import {
  Post,
  HttpCode,
  Param,
  ParseIntPipe,
  Body,
  Controller,
  UseFilters,
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
import { FestivalActivity, Refused } from "@overbookd/festival-event";
import { WRITE_FA, VALIDATE_FA } from "@overbookd/permission";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
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
import {
  ApproveActivityRequestDto,
  RejectActivityRequestDto,
} from "./dto/review.request.dto";
import { AddFeedbackRequestDto } from "./dto/add-feedback.request.dto";
import { FestivalActivityReviewService } from "./festival-activity-review.service";
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
export class FestivalActivityReviewController {
  constructor(private readonly reviewService: FestivalActivityReviewService) {}

  @Post(":faId/feedbacks")
  @Permissions(WRITE_FA)
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() feedback: AddFeedbackRequestDto,
  ): Promise<FestivalActivity> {
    return this.reviewService.addFeedback(faId, user, feedback);
  }

  @Post(":faId/ask-for-review")
  @Permissions(WRITE_FA)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalActivity> {
    return this.reviewService.toReview(faId, user);
  }

  @Post(":faId/approve")
  @Permissions(VALIDATE_FA)
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() { team }: ApproveActivityRequestDto,
  ): Promise<FestivalActivity> {
    return this.reviewService.approve(faId, user, team);
  }

  @Post(":faId/reject")
  @Permissions(VALIDATE_FA)
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() reject: RejectActivityRequestDto,
  ): Promise<Refused> {
    return this.reviewService.reject(faId, user, reject);
  }
}
