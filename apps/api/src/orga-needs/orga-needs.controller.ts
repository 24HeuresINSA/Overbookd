import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrgaNeedsService } from "./orga-needs.service";
import { Permission } from "../authentication/permissions-auth.decorator";
import { OrgaNeedsResponseDto } from "./dto/orga-needs.response.dto";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";

@ApiTags("orga-needs")
@Controller("orga-needs")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OrgaNeedsController {
  constructor(private readonly orgaNeedsService: OrgaNeedsService) {}

  @Permission(AFFECT_VOLUNTEER)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Returns the needs for a given day per 15 minutes interval",
    type: OrgaNeedsResponseDto,
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
  ): Promise<OrgaNeedsResponseDto[]> {
    const periodAndTeams = {
      start: new Date(start),
      end: new Date(end),
      teams: teams ?? [],
    };
    return this.orgaNeedsService.computeOrgaStats(periodAndTeams);
  }
}
