import {
  UseFilters,
  Controller,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { MobilizationSectionService } from "./mobilization-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import {
  FestivalTask,
  Mobilization,
  Volunteer,
} from "@overbookd/festival-event";
import { AddMobilizationRequestDto } from "./dto/add-mobilization.request.dto";
import { WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { UpdateMobilizationRequestDto } from "./dto/update-mobilization.request.dto";
import { TeamMobilizationRequestDto } from "./dto/team-mobilization.request.dto";
import { AddVolunteerRequestDto } from "./dto/add-volunteer.request.dto";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { InReviewFestivalTaskResponseDto } from "../../common/dto/reviewable/reviewable-festival-task.response.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
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
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Mobilization to add",
    type: AddMobilizationRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  addMobilization(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() mobilization: AddMobilizationRequestDto,
  ): Promise<FestivalTask> {
    return this.mobilizationService.add(ftId, mobilization);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Patch(":ftId/mobilizations/:mobilizationId")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  @ApiBody({
    description: "Mobilization to update",
    type: UpdateMobilizationRequestDto,
  })
  updateMobilization(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
    @Body() mobilization: UpdateMobilizationRequestDto,
  ): Promise<FestivalTask> {
    return this.mobilizationService.update(ftId, mobilizationId, mobilization);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/mobilizations/:mobilizationId")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  removeMobilization(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
  ): Promise<FestivalTask> {
    return this.mobilizationService.remove(ftId, mobilizationId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/mobilizations/:mobilizationId/volunteers")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  @ApiBody({
    description: "Volunteer id",
    type: AddVolunteerRequestDto,
  })
  addVolunteer(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
    @Body() { volunteerId }: AddVolunteerRequestDto,
  ): Promise<FestivalTask> {
    return this.mobilizationService.addVolunteer(
      ftId,
      mobilizationId,
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/mobilizations/:mobilizationId/volunteers/:volunteerId")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  @ApiParam({
    name: "volunteerId",
    type: Number,
    description: "Volunteer id",
    required: true,
  })
  removeVolunteer(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
    @Param("volunteerId", ParseIntPipe) volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    return this.mobilizationService.removeVolunteer(
      ftId,
      mobilizationId,
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/mobilizations/:mobilizationId/teams")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  @ApiBody({
    description: "Team to add",
    type: TeamMobilizationRequestDto,
  })
  addTeam(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
    @Body() team: TeamMobilizationRequestDto,
  ): Promise<FestivalTask> {
    return this.mobilizationService.addTeam(ftId, mobilizationId, team);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/mobilizations/:mobilizationId/teams/:teamCode")
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
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "mobilizationId",
    type: Number,
    description: "Mobilization id",
    required: true,
  })
  @ApiParam({
    name: "teamCode",
    type: String,
    description: "Team code to remove",
    required: true,
  })
  removeTeam(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("mobilizationId") mobilizationId: Mobilization["id"],
    @Param("teamCode") teamCode: string,
  ): Promise<FestivalTask> {
    return this.mobilizationService.removeTeam(ftId, mobilizationId, teamCode);
  }
}
