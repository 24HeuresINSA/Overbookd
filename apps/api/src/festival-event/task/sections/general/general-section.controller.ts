import {
  UseFilters,
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { GeneralSectionService } from "./general-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { FestivalTask } from "@overbookd/festival-event";
import { GeneralRequestDto } from "./dto/update-general.request.dto";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { InReviewFestivalTaskResponseDto } from "../../common/dto/reviewable/reviewable-festival-task.response.dto";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("festival-tasks")
@Controller("festival-tasks")
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}

  @Permission(WRITE_FT)
  @Patch(":id/general")
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
    type: GeneralRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() general: GeneralRequestDto,
  ): Promise<FestivalTask> {
    return this.generalService.update(id, general);
  }
}
