import { Controller, Get, ParseDatePipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { NeedHelpService } from "./need-help.service";
import { HelpingVolunteerResponseDto } from "./dto/helping-volunteer.response.dto";
import { ASK_FOR_HELP } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("need-help")
@ApiTags("need-help")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class NeedHelpController {
  constructor(private readonly needHelpService: NeedHelpService) {}

  @Get()
  @Permissions(ASK_FOR_HELP)
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
  getAvailableVolunteers(
    @Query("start", new ParseDatePipe()) start: Date,
    @Query("end", new ParseDatePipe()) end: Date,
  ) {
    return this.needHelpService.getAvailableVolunteers({ start, end });
  }
}
