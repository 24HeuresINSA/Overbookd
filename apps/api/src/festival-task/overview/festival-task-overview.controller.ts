import {
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Request,
  Controller,
  UseFilters,
  Delete,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { FestivalTask } from "@overbookd/festival-event";
import { READ_FT, WRITE_FT } from "@overbookd/permission";
import { RequestWithUserPayload } from "../../app.controller";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { CreateFestivalTaskRequestDto } from "./dto/create-festival-task.request.dto";
import { DraftFestivalTaskResponseDto } from "../common/dto/draft/draft-festival-task.response.dto";
import { FestivalTaskErrorFilter } from "../common/festival-task-error.filter";
import { FestivalTaskOverviewService } from "./festival-activity-overview.service";
import { DraftGeneralResponseDto } from "../common/dto/draft/draft-general.response.dto";
import { DraftInstructionsResponseDto } from "../common/dto/draft/draft-instructions.response.dto";
import { AdherentResponseDto } from "../common/dto/adherent.response.dto";
import { AppointmentResponseDto } from "../common/dto/appointment.response.dto";
import { ContactResponseDto } from "../common/dto/contact.response.dto";
import { FestivalActivityResponseDto } from "../common/dto/festival-activity.response.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../common/dto/inquiry-request.response.dto";
import { TimeWindowResponseDto } from "../common/dto/time-window.response.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  DraftFestivalTaskResponseDto,
  DraftGeneralResponseDto,
  DraftInstructionsResponseDto,
  AdherentResponseDto,
  AppointmentResponseDto,
  ContactResponseDto,
  FestivalActivityResponseDto,
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  TimeWindowResponseDto,
)
@UseFilters(FestivalTaskErrorFilter)
@Controller("festival-tasks")
export class FestivalTaskOverviewController {
  constructor(private readonly overviewService: FestivalTaskOverviewService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [{ $ref: getSchemaPath(DraftFestivalTaskResponseDto) }],
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  findById(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
  ): Promise<FestivalTask | null> {
    return this.overviewService.findById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post()
  @ApiResponse({
    status: 201,
    description: "A festival task",
    schema: {
      oneOf: [{ $ref: getSchemaPath(DraftFestivalTaskResponseDto) }],
    },
  })
  @ApiBody({
    description: "Festival task to create",
    type: CreateFestivalTaskRequestDto,
  })
  create(
    @Body() form: CreateFestivalTaskRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalTask> {
    return this.overviewService.create(user, form);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Festival task deleted",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: FestivalTask["id"]): Promise<void> {
    return this.overviewService.remove(id);
  }
}