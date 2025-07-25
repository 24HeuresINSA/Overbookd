import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { MultiPlanningService } from "./multi-planning.service";
import { MultiPlanningVolunteerResponseDto } from "./dto/multi-planning-volunteer.response.dto";
import { VIEW_PLANNING } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("multi-planning")
@ApiTags("multi-planning")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class MultiPlanningController {
  constructor(private readonly multiPlanningService: MultiPlanningService) {}

  @Get()
  @Permission(VIEW_PLANNING)
  @ApiQuery({
    name: "volunteerIds",
    required: true,
    description: "The volunteers ids",
    type: Number,
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: "Volunteers' plannings",
    type: MultiPlanningVolunteerResponseDto,
    isArray: true,
  })
  getVolunteers(
    @Query(
      "volunteerIds",
      new DefaultValuePipe([]),
      new ParseArrayPipe({ items: Number }),
    )
    volunteerIds: number[],
  ) {
    return this.multiPlanningService.getVolunteers(volunteerIds);
  }
}
