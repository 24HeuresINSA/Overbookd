import {
  UseGuards,
  Post,
  HttpCode,
  Param,
  ParseIntPipe,
  Body,
  Request,
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
import { RequestWithUserPayload } from "../../../app.controller";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
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
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
import {
  ApproveTaskRequestDto,
  IgnoreTaskRequestDto,
  RejectTaskRequestDto,
} from "./dto/review.request.dto";
import { CategorizeTaskRequestDto } from "./dto/categoryze.request.dto";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class FestivalTaskReviewController {
  constructor(private readonly reviewService: FestivalTaskReviewService) {}

  @Post(":ftId/feedbacks")
  @Permission(WRITE_FT)
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
    @Request() { user }: RequestWithUserPayload,
    @Body() feedback: PublishFeedbackRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.publishFeedback(ftId, user, feedback);
  }

  @Post(":ftId/ask-for-review")
  @Permission(WRITE_FT)
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
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalTask> {
    return this.reviewService.toReview(ftId, user);
  }

  @Post(":ftId/reject")
  @Permission(VALIDATE_FT)
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
    @Request() { user }: RequestWithUserPayload,
    @Body() reject: RejectTaskRequestDto,
  ): Promise<FestivalTaskRefused> {
    const jwt = new JwtUtil(user);
    return this.reviewService.reject(ftId, jwt, reject);
  }

  @Post(":ftId/approve")
  @Permission(VALIDATE_FT)
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
    @Request() { user }: RequestWithUserPayload,
    @Body() approve: ApproveTaskRequestDto,
  ): Promise<FestivalTask> {
    const jwt = new JwtUtil(user);
    return this.reviewService.approve(ftId, jwt, approve);
  }

  @Post(":ftId/ignore")
  @Permission(VALIDATE_FT)
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
    @Request() { user }: RequestWithUserPayload,
    @Body() ignore: IgnoreTaskRequestDto,
  ): Promise<FestivalTask> {
    const jwt = new JwtUtil(user);
    return this.reviewService.ignore(ftId, jwt, ignore);
  }

  @Post(":ftId/enable-assignment")
  @Permission(AFFECT_VOLUNTEER)
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
    @Request() { user }: RequestWithUserPayload,
    @Body() categorize: CategorizeTaskRequestDto,
  ): Promise<FestivalTaskReadyToAssign> {
    const jwt = new JwtUtil(user);
    return this.reviewService.enableAssignment(ftId, jwt, categorize);
  }
}
