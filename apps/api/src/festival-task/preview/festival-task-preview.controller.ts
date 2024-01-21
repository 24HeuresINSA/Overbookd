import { UseFilters, Controller, UseGuards, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiResponse,
} from "@nestjs/swagger";
import { PreviewFestivalTask } from "@overbookd/festival-event";
import { READ_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { PreviewFestivalTaskResponseDto } from "./dto/preview-festival-activity.response.dto";
import { FestivalTaskPreviewService } from "./festival-task-preview.service";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(PreviewFestivalTaskResponseDto)
@UseFilters(FestivalTaskErrorFilter)
@Controller("festival-tasks")
export class FestivalTaskPreviewController {
  constructor(private readonly previewService: FestivalTaskPreviewService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewFestivalTaskResponseDto,
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalTask[]> {
    return this.previewService.findForAll();
  }
}
