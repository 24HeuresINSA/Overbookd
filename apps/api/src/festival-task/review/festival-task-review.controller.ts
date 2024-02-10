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
} from "@nestjs/swagger";
import { FestivalTask } from "@overbookd/festival-event";
import { WRITE_FT } from "@overbookd/permission";
import { RequestWithUserPayload } from "../../app.controller";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { AddFeedbackRequestDto } from "./dto/add-feedback.request.dto";
import { FestivalTaskReviewService } from "./festival-task-review.service";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { DraftFestivalTaskResponseDto } from "../common/dto/draft/draft-festival-task.response.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter)
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
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Feedback to add to festival task",
    type: AddFeedbackRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  addFeedback(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() feedback: AddFeedbackRequestDto,
  ): Promise<FestivalTask> {
    return this.reviewService.addFeedback(ftId, user, feedback);
  }
}
