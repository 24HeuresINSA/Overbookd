import {
  UseFilters,
  Controller,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Post,
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
import { MobilizationSectionService } from "./mobilization-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { FestivalTask, Mobilization } from "@overbookd/festival-event";
import { AddMobilizationRequestDto } from "./dto/add-mobilization.request.dto";
import { WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
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
export class MobilizationSectionController {
  constructor(
    private readonly mobilizationService: MobilizationSectionService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/mobilizations")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Contact to add",
    type: AddMobilizationRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addContact(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() mobilization: AddMobilizationRequestDto,
  ): Promise<FestivalTask> {
    return this.mobilizationService.add(ftId, mobilization);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/mobilizations/:mobilizationId")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  removeContact(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
  ): Promise<FestivalTask> {
    return this.mobilizationService.remove(ftId, mobilizationId);
  }
}
