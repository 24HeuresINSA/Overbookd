import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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
import { MissingAssignmentTaskResponseDto } from "./dto/missing-assignment-task.response.dto";
import { TaskWithAssignmentsSummaryResponseDto } from "./dto/task-with-assignments-summary.response.dto";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignableVolunteerResponseDto } from "./dto/assignable-volunteer.reponse.dto";

@ApiBearerAuth()
@ApiTags("assignments/task-to-volunteer")
@Controller("assignments/task-to-volunteer")
@UseFilters(AssignmentErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class TaskToVolunteerController {
  constructor(private readonly taskToVolunteer: TaskToVolunteerService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("tasks")
  @ApiResponse({
    status: 200,
    description: "All tasks with missing assignments",
    type: MissingAssignmentTaskResponseDto,
    isArray: true,
  })
  findTasks(): Promise<TaskForAssignment[]> {
    return this.taskToVolunteer.findTasks();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("tasks/:id")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get(
    "tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId/assignable-volunteers",
  )
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
