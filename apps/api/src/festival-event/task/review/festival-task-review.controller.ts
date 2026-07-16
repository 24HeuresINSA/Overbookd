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
  ApiResponse,
  ApiBody,
  ApiParam,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  FestivalTask,
  FestivalTaskReadyToAssign,
  FestivalTaskRefused,
} from "@overbookd/festival-event";
import { AFFECT_VOLUNTEER, VALIDATE_FT, WRITE_FT } from "@overbookd/permission";
import { Permissions } from "../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { PublishFeedbackRequestDto } from "./dto/publish-feedback.request.dto";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { DraftFestivalTaskResponseDto } from "../common/dto/draft/draft-festival-task.response.dto";
import {
  InReviewFestivalTaskResponseDto,
  ReadyToAssignFestivalTaskResponseDto,
  RefusedFestivalTaskResponseDto,
  ValidatedFestivalTaskResponseDto,
} from "../common/dto/reviewable/reviewable-festival-task.response.dto";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import {
  ApproveTaskRequestDto,
  IgnoreTaskRequestDto,
  RejectTaskRequestDto,
  ReviewTaskRequestDto,
} from "./dto/review.request.dto";
import { CategorizeTaskRequestDto } from "./dto/categoryze.request.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";
import { AuthenticatedUser } from "../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class FestivalTaskReviewController {
  constructor(private readonly reviewService: FestivalTaskReviewService) {}

  @Post(":ftId/feedbacks")
  @Permissions(WRITE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Feedback to add to festival task",
    type: PublishFeedbackRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  publishFeedback(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() feedback: PublishFeedbackRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.publishFeedback(ftId, user, feedback);
  }

  @Post(":ftId/ask-for-review")
  @Permissions(WRITE_FT)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    type: InReviewFestivalTaskResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  askForReview(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.reviewService.toReview(ftId, user);
  }

  @Post(":ftId/reject")
  @Permissions(VALIDATE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    type: RefusedFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Festival task rejection",
    type: RejectTaskRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  reject(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() reject: RejectTaskRequestDto,
  ): Promise<FestivalTaskRefused> {
    return this.reviewService.reject(ftId, user, reject);
  }

  @Post(":ftId/approve")
  @Permissions(VALIDATE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Festival task approval",
    type: ApproveTaskRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  approve(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() approve: ApproveTaskRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.approve(ftId, user, approve);
  }

  @Post(":ftId/ignore")
  @Permissions(VALIDATE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Festival task ignore",
    type: IgnoreTaskRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  ignore(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() ignore: IgnoreTaskRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.ignore(ftId, user, ignore);
  }

  @Post(":ftId/review")
  @Permissions(VALIDATE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Festival task review",
    type: ReviewTaskRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  review(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() review: ReviewTaskRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.review(ftId, user, review);
  }

  @Post(":ftId/enable-assignment")
  @Permissions(AFFECT_VOLUNTEER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    type: ReadyToAssignFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Festival task category",
    type: CategorizeTaskRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  enableAssignments(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() categorize: CategorizeTaskRequestDto,
  ): Promise<FestivalTaskReadyToAssign> {
    return this.reviewService.enableAssignment(ftId, user, categorize);
  }
}
