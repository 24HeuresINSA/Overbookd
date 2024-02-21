import { UseFilters, Controller, UseGuards, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { PreviewFestivalTask } from "@overbookd/festival-event";
import { READ_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { PreviewFestivalTaskDraftResponseDto } from "./dto/preview-festival-task-draft.response.dto";
import { FestivalTaskPreviewService } from "./festival-task-preview.service";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { PreviewFestivalTaskInReviewResponseDto } from "./dto/preview-festival-task-in-review.response.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  PreviewFestivalTaskDraftResponseDto,
  PreviewFestivalTaskInReviewResponseDto,
)
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@Controller("festival-tasks")
export class FestivalTaskPreviewController {
  constructor(private readonly previewService: FestivalTaskPreviewService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All festival tasks",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PreviewFestivalTaskDraftResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskInReviewResponseDto) },
      ],
    },
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalTask[]> {
    return this.previewService.findForAll();
  }
}
