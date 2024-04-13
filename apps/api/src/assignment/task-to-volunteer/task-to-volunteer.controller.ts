import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { MissingAssignmentTaskResponseDto } from "./dto/missing-assignment-task.response.dto";
import { TaskWithAssignmentsSummaryResponseDto } from "./dto/task-with-assignments-summary.response.dto";

@ApiBearerAuth()
@ApiTags("assignments/task-to-volunteer")
@Controller("assignments/task-to-volunteer")
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
  findTasks(): Promise<MissingAssignmentTask[]> {
    return this.taskToVolunteer.findTasks();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("tasks/:id")
  @ApiResponse({
    status: 200,
    description: "Selected task with assignments summary",
    type: TaskWithAssignmentsSummaryResponseDto,
    isArray: true,
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
}
