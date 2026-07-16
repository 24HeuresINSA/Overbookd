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
  UseFilters,
} from "@nestjs/common";
import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  getSchemaPath,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignmentService } from "./assignment.service";
import {
  AFFECT_VOLUNTEER,
  READ_FT,
  VIEW_PLANNING,
} from "@overbookd/permission";
import {
  AssignmentResponseDto,
  NamelyDemandedDto,
  TeamMemberDto,
} from "./dto/assignment.response.dto";
import { PlanningEventResponseDto } from "./dto/planning-event.response.dto";
import { VolunteersForAssignmentRequestDto } from "./dto/volunteers-for-assignment.request.dto";
import { AssignmentWithDetailsResponseDto } from "./dto/assignment-details.response.dto";
import {
  AssignmentStatsResponseDto,
  VolunteerWithAssignmentStatsResponseDto,
} from "./dto/volunteer-with-assignment-stats.response.dto";
import { TaskForCalendar, VolunteerWithAssignmentStats } from "@overbookd/http";
import { TaskForCalendarResponseDto } from "./dto/task-for-calendar.response.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { AuthenticatedUser } from "../../authentication-zitadel/decorators/authenticated-user.decorator";

@Controller("assignments")
@ApiTags("assignments")
@ApiBearerAuth()
@UseFilters(AssignmentErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(NamelyDemandedDto, TeamMemberDto)
export class AssignmentController {
  constructor(private readonly assignment: AssignmentService) {}

  @Get(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/for-calendar",
  )
  @Permissions(VIEW_PLANNING)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<TaskForCalendar> {
    const identifier = { taskId, mobilizationId, assignmentId };
    return this.assignment.findOneForCalendar(identifier, user.id);
  }

  @Get("tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId")
  @Permissions(READ_FT)
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

  @Get("volunteers/:volunteerId/planning")
  @Permissions(AFFECT_VOLUNTEER)
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
  @Permissions(AFFECT_VOLUNTEER)
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
  @Permissions(AFFECT_VOLUNTEER)
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
  @Permissions(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get assignments stats for all volunteers",
    isArray: true,
    type: VolunteerWithAssignmentStatsResponseDto,
  })
  async getAllVolunteersStats(): Promise<VolunteerWithAssignmentStats[]> {
    return this.assignment.getAllVolunteersStats();
  }

  @Get("stats/:id")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get duration of assignments for a volunteer",
    type: AssignmentStatsResponseDto,
  })
  async getOneVolunteerStats(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<AssignmentStatsResponseDto> {
    return this.assignment.getOneVolunteerStats(id);
  }
}
