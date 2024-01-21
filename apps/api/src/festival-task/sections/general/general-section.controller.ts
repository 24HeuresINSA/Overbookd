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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { GeneralSectionService } from "./general-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { WRITE_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { FestivalTask } from "@overbookd/festival-event";
import { GeneralRequestDto } from "./dto/update-general.request.dto";

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
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/general")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "General section of festival activity to save",
    type: GeneralRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  save(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() general: GeneralRequestDto,
  ): Promise<FestivalTask> {
    return this.generalService.save(id, general);
  }
}
