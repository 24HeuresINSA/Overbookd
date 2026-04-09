import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request as RequestDecorator,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { TaskForCalendar, VolunteerWithAssignmentStats } from "@overbookd/http";
import {
  AFFECT_VOLUNTEER,
  READ_FT,
  VIEW_PLANNING,
} from "@overbookd/permission";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { RequestWithUserPayload } from "../../app.controller";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignmentService } from "./assignment.service";
import { AssignmentWithDetailsResponseDto } from "./dto/assignment-details.response.dto";
import {
  AssignmentResponseDto,
  NamelyDemandedDto,
  TeamMemberDto,
} from "./dto/assignment.response.dto";
import { DisplayableAssignmentResponseDto } from "./dto/displayable-assignment.response.dto";
import { PlanningEventResponseDto } from "./dto/planning-event.response.dto";
import { TaskForCalendarResponseDto } from "./dto/task-for-calendar.response.dto";
import { VolunteerWithAssignmentStatsResponseDto } from "./dto/volunteer-with-assignment-stats.response.dto";
import { VolunteersForAssignmentRequestDto } from "./dto/volunteers-for-assignment.request.dto";

@Controller("assignments")
@ApiTags("assignments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(AssignmentErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(NamelyDemandedDto, TeamMemberDto)
export class AssignmentController {
  constructor(private readonly assignment: AssignmentService) {}

  @Get(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/for-calendar",
  )
  @Permission(VIEW_PLANNING)
  @ApiResponse({
    status: 200,
    description: "Assignment For Calendar",
    type: TaskForCalendarResponseDto,
  })
  @ApiParam({
    name: "taskId",
    description: "Task id",
    type: Number,
  })
  @ApiParam({
    name: "mobilizationId",
    description: "Mobilization id",
    type: String,
  })
  @ApiParam({
    name: "assignmentId",
    description: "Assignment id",
    type: String,
  })
  findOneForCalendar(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("mobilizationId") mobilizationId: string,
    @Param("assignmentId") assignmentId: string,
    @RequestDecorator() request: RequestWithUserPayload,
  ): Promise<TaskForCalendar> {
    const volunteerId = request.user.id;
    const identifier = { taskId, mobilizationId, assignmentId };
    return this.assignment.findOneForCalendar(identifier, volunteerId);
  }

  @Get("tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId")
  @Permission(READ_FT)
  @ApiResponse({
    status: 200,
    description: "Assignment",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AssignmentResponseDto) },
        { $ref: getSchemaPath(AssignmentWithDetailsResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "taskId",
    description: "Task id",
    type: Number,
  })
  @ApiParam({
    name: "mobilizationId",
    description: "Mobilization id",
    type: String,
  })
  @ApiParam({
    name: "assignmentId",
    description: "Assignment id",
    type: String,
  })
  @ApiQuery({
    name: "withDetails",
    required: false,
    type: Boolean,
    description: "Include details",
  })
  findOne(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("mobilizationId") mobilizationId: string,
    @Param("assignmentId") assignmentId: string,
    @Query("withDetails") withDetails?: string,
  ): Promise<AssignmentResponseDto | AssignmentWithDetailsResponseDto> {
    const identifier = { taskId, mobilizationId, assignmentId };
    return this.assignment.findOne(identifier, withDetails === "true");
  }

  @Get("volunteers/:volunteerId/assignments")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteer assignments",
    type: DisplayableAssignmentResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "volunteerId",
    description: "Volunteer id",
    type: Number,
  })
  findAllFor(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<DisplayableAssignmentResponseDto[]> {
    return this.assignment.findAllFor(volunteerId);
  }

  @Get("volunteers/:volunteerId/planning")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteer planning",
    type: PlanningEventResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "volunteerId",
    description: "Volunteer id",
    type: Number,
  })
  getPlanning(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<PlanningEventResponseDto[]> {
    return this.assignment.getPlanning(volunteerId);
  }

  @Post()
  @Permission(AFFECT_VOLUNTEER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Assignment with new assignees",
    type: AssignmentResponseDto,
  })
  @ApiBody({
    description: "Volunteers for assignment",
    type: VolunteersForAssignmentRequestDto,
  })
  assign(
    @Body() volunteersForAssignment: VolunteersForAssignmentRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignment.assign(volunteersForAssignment);
  }

  @Delete(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/assignees/:assigneeId",
  )
  @Permission(AFFECT_VOLUNTEER)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Assignment unassigned",
  })
  @ApiParam({
    name: "taskId",
    description: "Task id",
    type: Number,
  })
  @ApiParam({
    name: "mobilizationId",
    description: "Mobilization id",
    type: String,
  })
  @ApiParam({
    name: "assignmentId",
    description: "Assignment id",
    type: String,
  })
  @ApiParam({
    name: "assigneeId",
    description: "Assignee id",
    type: Number,
  })
  unassign(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("mobilizationId") mobilizationId: string,
    @Param("assignmentId") assignmentId: string,
    @Param("assigneeId", ParseIntPipe) assigneeId: number,
  ): Promise<void> {
    const identifier = { taskId, mobilizationId, assignmentId };
    return this.assignment.unassign(identifier, assigneeId);
  }

  @Get("stats")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get assignments stats for all volunteers",
    isArray: true,
    type: VolunteerWithAssignmentStatsResponseDto,
  })
  async getVolunteerAssignmentStats(): Promise<VolunteerWithAssignmentStats[]> {
    return this.assignment.getVolunteersAssignmentStats();
  }
}
