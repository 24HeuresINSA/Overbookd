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
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignmentService } from "./assignment.service";
import { AFFECT_VOLUNTEER, BE_AFFECTED } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import {
  AssignmentResponseDto,
  NamelyDemandedDto,
  TeamMemberDto,
} from "./dto/assignment.response.dto";
import { PlanningEventResponseDto } from "./dto/planning-event.response.dto";
import { VolunteersForAssignmentRequestDto } from "./dto/volunteers-for-assignment.request.dto";
import { AssignmentWithDetailsResponseDto } from "./dto/assignment-details.response.dto";
import { DisplayableAssignmentResponseDto } from "./dto/displayable-assignment.response.dto";
import { VolunteerWithAssignmentStatsResponseDto } from "./dto/volunteer-with-assignment-stats.response.dto";
import { VolunteerWithAssignmentStats } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("assignments")
@Controller("assignments")
@UseFilters(AssignmentErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(NamelyDemandedDto, TeamMemberDto)
export class AssignmentController {
  constructor(private readonly assignment: AssignmentService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(BE_AFFECTED)
  @Get("tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteers/:volunteerId/assignments")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteers/:volunteerId/planning")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Post()
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Delete(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/assignees/:assigneeId",
  )
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @Get("stats")
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
