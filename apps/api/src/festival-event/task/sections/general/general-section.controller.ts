import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { FestivalTask } from "@overbookd/festival-event";
import { WRITE_FT } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { InReviewFestivalTaskResponseDto } from "../../common/dto/reviewable/reviewable-festival-task.response.dto";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { GeneralTaskRequestDto } from "./dto/update-general.request.dto";
import { GeneralSectionService } from "./general-section.service";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}

  @Patch(":id/general")
  @Permission(WRITE_FT)
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "General section of festival task to save",
    type: GeneralTaskRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() general: GeneralTaskRequestDto,
  ): Promise<FestivalTask> {
    return this.generalService.update(id, general);
  }
}
