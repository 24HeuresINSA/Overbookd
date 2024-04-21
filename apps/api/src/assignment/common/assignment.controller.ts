import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
} from "@nestjs/swagger";
import { AssignmentErrorFilter } from "../assignment.filter";
import { AssignmentService } from "./assignment.service";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { AssignmentResponseDto } from "./dto/assignment.response.dto";
import { PlanningEventResponseDto } from "./dto/planning-event.response.dto";

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
export class AssignmentController {
  constructor(private readonly assignment: AssignmentService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("tasks/:taskId/mobilizations/:mobilizationId/assignments/:assignmentId")
  @ApiResponse({
    status: 200,
    description: "Assignment",
    type: AssignmentResponseDto,
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
  findOne(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("mobilizationId") mobilizationId: string,
    @Param("assignmentId") assignmentId: string,
  ): Promise<AssignmentResponseDto> {
    return this.assignment.findOne({
      taskId,
      mobilizationId,
      assignmentId,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Get("planning/:volunteerId")
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
}
