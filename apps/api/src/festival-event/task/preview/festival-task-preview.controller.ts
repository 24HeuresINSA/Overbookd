import {
  UseFilters,
  Controller,
  UseGuards,
  Get,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { PreviewFestivalTask } from "@overbookd/festival-event";
import { READ_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { FestivalTaskPreviewService } from "./festival-task-preview.service";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { PreviewFestivalTaskDraftResponseDto } from "./dto/preview-festival-task-draft.response.dto";
import { PreviewFestivalTaskInReviewResponseDto } from "./dto/preview-festival-task-in-review.response.dto";
import { PreviewFestivalTaskRefusedResponseDto } from "./dto/preview-festival-task-refused.response.dto";
import { PreviewFestivalTaskValidatedResponseDto } from "./dto/preview-festival-task-validated.response.dto";
import { RequestWithUserPayload } from "../../../app.controller";
import { ApiSwaggerResponse } from "../../../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("festival-tasks")
@Controller("festival-tasks")
@ApiExtraModels(
  PreviewFestivalTaskDraftResponseDto,
  PreviewFestivalTaskInReviewResponseDto,
  PreviewFestivalTaskRefusedResponseDto,
  PreviewFestivalTaskValidatedResponseDto,
)
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class FestivalTaskPreviewController {
  constructor(private readonly previewService: FestivalTaskPreviewService) {}

  @Get()
  @Permission(READ_FT)
  @ApiResponse({
    status: 200,
    description: "All festival tasks",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PreviewFestivalTaskDraftResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskInReviewResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskRefusedResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskValidatedResponseDto) },
      ],
    },
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalTask[]> {
    return this.previewService.findForAll();
  }

  @Get("mine")
  @Permission(READ_FT)
  @ApiResponse({
    status: 200,
    description: "My festival tasks",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PreviewFestivalTaskDraftResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskInReviewResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskRefusedResponseDto) },
        { $ref: getSchemaPath(PreviewFestivalTaskValidatedResponseDto) },
      ],
    },
    isArray: true,
  })
  findMine(
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreviewFestivalTask[]> {
    return this.previewService.findMine(user.id);
  }
}
