import { Controller, Get, ParseDatePipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { TimelineEventResponseDto } from "./dto/timeline-event.response.dto";
import { TimelineService } from "./timeline.service";
import { VIEW_TIMELINE } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("timeline")
@ApiTags("timeline")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  @Permissions(VIEW_TIMELINE)
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
    @Query("start", new ParseDatePipe()) start: Date,
    @Query("end", new ParseDatePipe()) end: Date,
  ): Promise<TimelineEventResponseDto[]> {
    return this.timelineService.getTimelines({ start, end });
  }
}
