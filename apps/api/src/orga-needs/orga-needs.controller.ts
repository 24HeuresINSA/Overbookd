import {
  Controller,
  Get,
  ParseArrayPipe,
  ParseDatePipe,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrgaNeedsService } from "./orga-needs.service";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { OrgaNeedDetailsDto } from "./dto/orga-needs.response.dto";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("orga-needs")
@ApiTags("orga-needs")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class OrgaNeedsController {
  constructor(private readonly orgaNeedsService: OrgaNeedsService) {}

  @Get()
  @Permissions(AFFECT_VOLUNTEER)
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
    @Query("start", new ParseDatePipe()) start: Date,
    @Query("end", new ParseDatePipe()) end: Date,
    @Query("teams", new ParseArrayPipe({ optional: true })) teams?: string[],
  ): Promise<OrgaNeedDetailsDto[]> {
    const periodAndTeams = { start, end, teams: teams ?? [] };
    return this.orgaNeedsService.computeOrgaStats(periodAndTeams);
  }
}
