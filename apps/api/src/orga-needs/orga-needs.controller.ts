import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrgaNeedsService } from "./orga-needs.service";
import { Permission } from "../authentication/permissions-auth.decorator";
import { OrgaNeedDetailsDto } from "./dto/orga-needs.response.dto";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("orga-needs")
@ApiTags("orga-needs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class OrgaNeedsController {
  constructor(private readonly orgaNeedsService: OrgaNeedsService) {}

  @Get()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Returns the needs for a given day per 15 minutes interval",
    type: OrgaNeedDetailsDto,
    isArray: true,
  })
  @ApiQuery({
    name: "start",
    required: true,
    type: Date,
  })
  @ApiQuery({
    name: "end",
    required: true,
    type: Date,
  })
  @ApiQuery({
    name: "teams",
    required: false,
    type: String,
    isArray: true,
  })
  async getOrgaNeeds(
    @Query("start") start: Date,
    @Query("end") end: Date,
    @Query("teams") teams?: string[],
  ): Promise<OrgaNeedDetailsDto[]> {
    const periodAndTeams = {
      start: new Date(start),
      end: new Date(end),
      teams: teams ?? [],
    };
    return this.orgaNeedsService.computeOrgaStats(periodAndTeams);
  }
}
