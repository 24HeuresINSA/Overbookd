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
import { FestivalTask, FestivalTaskRefused } from "@overbookd/festival-event";
import { VALIDATE_FT, WRITE_FT } from "@overbookd/permission";
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
  RefusedFestivalTaskResponseDto,
  ValidatedFestivalTaskResponseDto,
} from "../common/dto/reviewable/reviewable-festival-task.response.dto";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
import { ApproveRequestDto, RejectRequestDto } from "./dto/review.request.dto";

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
    @Param("ftId", ParseIntPipe) faId: FestivalTask["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() reject: RejectRequestDto,
  ): Promise<FestivalTaskRefused> {
    const jwt = new JwtUtil(user);
    return this.reviewService.reject(faId, jwt, reject);
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
    @Param("ftId", ParseIntPipe) faId: FestivalTask["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() approve: ApproveRequestDto,
  ): Promise<FestivalTask> {
    const jwt = new JwtUtil(user);
    return this.reviewService.approve(faId, jwt, approve);
  }
}
