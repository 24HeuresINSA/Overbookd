import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import {
  AssignableVolunteer,
  TaskForAssignment,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { TaskForAssignmentResponseDto } from "./dto/missing-assignment-task.response.dto";
import { TaskWithAssignmentsSummaryResponseDto } from "./dto/task-with-assignments-summary.response.dto";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignableVolunteerResponseDto } from "./dto/assignable-volunteer.reponse.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("assignments/task-to-volunteer")
@ApiTags("assignments/task-to-volunteer")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(AssignmentErrorFilter)
@ApiSwaggerResponse()
export class TaskToVolunteerController {
  constructor(private readonly taskToVolunteer: TaskToVolunteerService) {}

  @Get("assignableTasks")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "All tasks with missing assignments",
    type: TaskForAssignmentResponseDto,
    isArray: true,
  })
  findAssignableTasks(): Promise<TaskForAssignment[]> {
    return this.taskToVolunteer.findAssignableTasks();
  }

  @Get("allTasks")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "All tasks",
    type: TaskForAssignmentResponseDto,
    isArray: true,
  })
  findAllTasks(): Promise<TaskForAssignment[]> {
    return this.taskToVolunteer.findAllTasks();
  }

  @Get("tasks/:id")
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Selected task with assignments summary",
    type: TaskWithAssignmentsSummaryResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "Task id",
    type: Number,
  })
  selectTask(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TaskWithAssignmentsSummary> {
    return this.taskToVolunteer.selectTask(id);
  }

  @Get(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/assignable-volunteers",
  )
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Assignable volunteers for the selected assignment",
    type: AssignableVolunteerResponseDto,
    isArray: true,
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
  getAssignableVolunteersForAssignment(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("mobilizationId") mobilizationId: string,
    @Param("assignmentId") assignmentId: string,
  ): Promise<AssignableVolunteer[]> {
    return this.taskToVolunteer.selectAssignment({
      taskId,
      mobilizationId,
      assignmentId,
    });
  }
}
