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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
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
  ApproveRequestDto,
  IgnoreTaskRequestDto,
  RejectRequestDto,
} from "./dto/review.request.dto";
import { CategorizeTaskRequestDto } from "./dto/categoryze.request.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@Controller("festival-tasks")
export class FestivalTaskReviewController {
  constructor(private readonly reviewService: FestivalTaskReviewService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/feedbacks")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/ask-for-review")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FT)
  @Post(":ftId/reject")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    type: RefusedFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Festival task rejection",
    type: RejectRequestDto,
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
    @Body() reject: RejectRequestDto,
  ): Promise<FestivalTaskRefused> {
    const jwt = new JwtUtil(user);
    return this.reviewService.reject(ftId, jwt, reject);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FT)
  @Post(":ftId/approve")
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
    type: ApproveRequestDto,
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
    @Body() approve: ApproveRequestDto,
  ): Promise<FestivalTask> {
    const jwt = new JwtUtil(user);
    return this.reviewService.approve(ftId, jwt, approve);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FT)
  @Post(":ftId/ignore")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Post(":ftId/enable-assignment")
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
