import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { TimelineEventResponseDto } from "./dto/timeline-event.response.dto";
import { TimelineService } from "./timeline.service";
import { VIEW_TIMELINE } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("timeline")
@ApiTags("timeline")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  @Permission(VIEW_TIMELINE)
  @ApiQuery({
    name: "start",
    required: true,
    description: "The start of timelines",
    type: Date,
  })
  @ApiQuery({
    name: "end",
    required: true,
    description: "The end of timelines",
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: "The timeline has been successfully retrieved.",
    type: TimelineEventResponseDto,
    isArray: true,
  })
  async getTimelines(
    @Query("start") start: Date,
    @Query("end") end: Date,
  ): Promise<TimelineEventResponseDto[]> {
    const period = { start: new Date(start), end: new Date(end) };
    return this.timelineService.getTimelines(period);
  }
}
