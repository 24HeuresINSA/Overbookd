import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { NeedHelpService } from "./need-help.service";
import { HelpingVolunteerResponseDto } from "./dto/helping-volunteer.response.dto";
import { ASK_FOR_HELP } from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("need-help")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Resource not found",
})
@Controller("need-help")
export class NeedHelpController {
  constructor(private readonly needHelpService: NeedHelpService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(ASK_FOR_HELP)
  @Get()
  @HttpCode(200)
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
