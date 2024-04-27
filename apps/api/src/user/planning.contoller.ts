import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PeriodDto } from "../volunteer-availability/dto/period.dto";
import { AFFECT_VOLUNTEER, VIEW_VOLUNTEER } from "@overbookd/permission";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PlanningService } from "./planning.service";
import { BreakPeriodDuringRequestDto } from "./dto/break-period-during.request.dto";
import { Duration } from "@overbookd/period";

@ApiBearerAuth()
@ApiTags("planning")
@Controller("planning")
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class PlanningController {
  constructor(private readonly planning: PlanningService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @Get(":volunteerId/break-periods")
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodDto,
    isArray: true,
  })
  async getVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<PeriodDto[]> {
    return this.planning.getBreakPeriods(volunteerId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @Post(":volunteerId/break-periods")
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodDto,
    isArray: true,
  })
  @ApiBody({
    description: "Break period during",
    type: BreakPeriodDuringRequestDto,
  })
  async addVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteer: number,
    @Body() { start, durationInHours }: BreakPeriodDuringRequestDto,
  ): Promise<PeriodDto[]> {
    const duration = Duration.hours(durationInHours);
    return this.planning.addBreakPeriod({
      volunteer,
      during: { start, duration },
    });
  }
}
