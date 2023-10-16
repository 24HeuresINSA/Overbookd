import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA } from "@overbookd/permission";
import { LiteFestivalActivity } from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { LiteFestivalActivityResponseDto } from "./dto/lite-festival-activity.reponse.dto";
import { Permission } from "../authentication/permissions-auth.decorator";

@ApiBearerAuth()
@ApiTags("festival-activity")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("festival-activity")
export class FestivalActivityController {
  constructor(
    private readonly festivalActivityService: FestivalActivityService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 201,
    description: "All festival activities",
    type: LiteFestivalActivityResponseDto,
    isArray: true,
  })
  findAll(): Promise<LiteFestivalActivity[]> {
    return this.festivalActivityService.findAll();
  }
}
