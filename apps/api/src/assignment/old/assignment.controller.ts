import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { AssignmentService, AssignmentStats } from "./assignment.service";
import {
  AssignmentRequestDto,
  UpdateAssignedTeamRequestDto,
} from "./dto/assignment.request.dto";
import { AssignmentResponseDto } from "./dto/assignment.response.dto";
import { AssignmentStatsResponseDto } from "./dto/assignment-stats.response.dto";
import {
  FtTimeSpanResponseDto,
  TimeSpanWithAssigneesResponseDto,
  TimeSpanWithFtResponseDto,
} from "./dto/ft-time-span.response.dto";
import {
  AvailableVolunteerResponseDto,
  VolunteerResponseDto,
} from "./dto/volunteer.response.dto";
import { FtTimeSpanService } from "./ft-time-span.service";
import { TimeSpan, TimeSpanWithAssignees } from "./model/ft-time-span.model";
import { VolunteerService } from "./volunteer.service";
import { AFFECT_VOLUNTEER, BE_AFFECTED } from "@overbookd/permission";
import { TaskWithPeriodsResponseDto } from "./dto/task-period.response.dto";
import { TaskPeriodService } from "./task-period.service";

@ApiBearerAuth()
@ApiTags("assignments")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("assignments")
class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly volunteerService: VolunteerService,
    private readonly ftTimeSpanService: FtTimeSpanService,
    private readonly taskPeriodService: TaskPeriodService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteers")
  @ApiResponse({
    status: 200,
    description: "Get all valid volunteers",
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAllVolunteers(): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAllVolunteers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("task-periods")
  @ApiResponse({
    status: 200,
    description: "Get all valid task with periods",
    isArray: true,
    type: TaskWithPeriodsResponseDto,
  })
  findAllFtTimeSpans(): Promise<TaskWithPeriodsResponseDto[]> {
    return this.taskPeriodService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @Get("stats")
  @ApiResponse({
    status: 200,
    description: "Get assignments stats for all volunteers",
    isArray: true,
    type: AssignmentStatsResponseDto,
  })
  async getVolunteerAssignmentStats(): Promise<AssignmentStats[]> {
    return this.assignmentService.getVolunteersAssignmentStats();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("ft/:ftId")
  @ApiResponse({
    status: 200,
    description: "Get ft with time spans and stats",
    isArray: true,
    type: FtTimeSpanResponseDto,
  })
  findFtTimeSpans(
    @Param("ftId", ParseIntPipe) ftId: number,
  ): Promise<TimeSpan[]> {
    return this.ftTimeSpanService.findTimeSpansForFt(ftId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteer/:volunteerId/ft-timespans")
  @ApiResponse({
    status: 200,
    description: "Get ft time spans available for volunteer",
    isArray: true,
    type: TimeSpanWithFtResponseDto,
  })
  findFtTimeSpansAvailableForVolunteer(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<TimeSpanWithFtResponseDto[]> {
    return this.ftTimeSpanService.findTimeSpansWithFtWhereVolunteerIsAssignableTo(
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("ft-timespans/:timeSpanId/volunteers")
  @ApiResponse({
    status: 200,
    description: "Get volunteers available for ft time span",
    isArray: true,
    type: AvailableVolunteerResponseDto,
  })
  findAvailableVolunteersForFtTimeSpan(
    @Param("timeSpanId", ParseIntPipe) timeSpanId: number,
  ): Promise<AvailableVolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteersForFtTimeSpan(
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(BE_AFFECTED)
  @Get("ft-timespans/:timeSpanId")
  @ApiResponse({
    status: 200,
    description: "Get time span details",
    type: TimeSpanWithAssigneesResponseDto,
  })
  findTimeSpanDetails(
    @Param("timeSpanId", ParseIntPipe) timeSpanId: number,
  ): Promise<TimeSpanWithAssignees> {
    return this.ftTimeSpanService.findTimeSpanWithAssignees(timeSpanId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("ft-timespans/:timeSpanId/volunteers/:volunteerId/available-friends")
  @ApiResponse({
    status: 200,
    description: "Get volunteer's friends available for ft time span",
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAvailableVolunteerFriendsForFtTimeSpan(
    @Param("timeSpanId", ParseIntPipe) timeSpanId: number,
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteerFriendsForFtTimeSpan(
      timeSpanId,
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Affect volunteers to time span as team member",
    type: AssignmentResponseDto,
  })
  assignVolunteerToTimeSpan(
    @Body() { volunteers, timeSpanId }: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto[]> {
    return this.assignmentService.assignVolunteersToTimeSpan(
      volunteers,
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Delete("ft-timespans/:timeSpanId/volunteers/:assigneeId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Unaffect volunteers from time span",
  })
  unassignVolunteerToTimeSpan(
    @Param("timeSpanId", ParseIntPipe) timeSpanId: number,
    @Param("assigneeId", ParseIntPipe) assigneeId: number,
  ) {
    return this.assignmentService.unassignVolunteerToTimeSpan(
      assigneeId,
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Patch("ft-timespans/:timeSpanId/assignees/:assigneeId/affected-team")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Update assigned team for assignee",
    type: AssignmentResponseDto,
  })
  updateAssignedTeam(
    @Param("timeSpanId", ParseIntPipe) timeSpanId: number,
    @Param("assigneeId", ParseIntPipe) assigneeId: number,
    @Body() { team }: UpdateAssignedTeamRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.updateAssignedTeam(
      timeSpanId,
      assigneeId,
      team,
    );
  }
}

// To avoid prune error
console.log(AssignmentController);
