import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { NeedHelpService } from "./need-help.service";
import { HelpingVolunteerResponseDto } from "./dto/helping-volunteer.response.dto";
import { ASK_FOR_HELP } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("need-help")
@Controller("need-help")
@ApiSwaggerResponse()
export class NeedHelpController {
  constructor(private readonly needHelpService: NeedHelpService) {}

  @Get()
  @Permission(ASK_FOR_HELP)
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
    description: "Available volunteers",
    type: HelpingVolunteerResponseDto,
    isArray: true,
  })
  getAvailableVolunteers(@Query("start") start: Date, @Query("end") end: Date) {
    return this.needHelpService.getAvailableVolunteers({ start, end });
  }
}
