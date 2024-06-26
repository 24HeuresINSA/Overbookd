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
import { VolunteerToTaskService } from "./volunteer-to-task.service";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { VolunteerWithAssignmentDurationResponseDto } from "./dto/volunteer-with-assignment-duration.response.dto";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AssignmentSummaryWithTaskResponseDto } from "./dto/assignment-summary-with-task.response.dto";

@ApiBearerAuth()
@ApiTags("assignments/volunteer-to-task")
@Controller("assignments/volunteer-to-task")
@UseFilters(AssignmentErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class VolunteerToTaskController {
  constructor(private readonly volunteerToTask: VolunteerToTaskService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteers")
  @ApiResponse({
    status: 200,
    description: "All assignable volunteers with assignment duration",
    type: VolunteerWithAssignmentDurationResponseDto,
    isArray: true,
  })
  findVolunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    return this.volunteerToTask.findVolunteers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("volunteers/:volunteerId/assignments")
  @ApiResponse({
    status: 200,
    description: "All assignments for volunteer",
    type: AssignmentSummaryWithTaskResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "volunteerId",
    description: "Volunteer id",
    type: Number,
  })
  findAssignments(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<AssignmentSummaryWithTask[]> {
    return this.volunteerToTask.findAssignmentsFor(volunteerId);
  }
}
