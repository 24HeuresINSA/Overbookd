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
import { InstructionsSectionService } from "./instructions-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { WRITE_FT } from "@overbookd/permission";
import { FestivalTask } from "@prisma/client";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { InstructionsRequestDto } from "./dto/update-instructions.request.dto";
import { Permission } from "../../../authentication/permissions-auth.decorator";

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
export class InstructionsSectionController {
  constructor(
    private readonly instructionsService: InstructionsSectionService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Patch(":id/instructions")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Instructions section of festival activity to save",
    type: InstructionsRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  save(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() general: InstructionsRequestDto,
  ): Promise<FestivalTask> {
    return this.instructionsService.save(id, general);
  }
}
