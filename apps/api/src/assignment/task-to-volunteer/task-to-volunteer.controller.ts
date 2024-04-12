import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { MissingAssignmentTask } from "@overbookd/assignment";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { MissingAssignmentTaskResponseDto } from "./dto/missing-assignment-task.response.dto";

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
  findVolunteers(): Promise<MissingAssignmentTask[]> {
    return this.taskToVolunteer.findTasks();
  }
}
