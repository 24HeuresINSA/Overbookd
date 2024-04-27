import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
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
import { Duration, Period } from "@overbookd/period";
import { ParseDatePipe } from "../common/pipes/parse-date.pipe";

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @Delete(":volunteerId/break-periods")
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodDto,
    isArray: true,
  })
  @ApiBody({
    description: "Period to remove break from",
    type: PeriodDto,
  })
  @ApiParam({
    name: "volunteerId",
    type: Number,
    description: "Volunteer identifier to remove break from",
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
  async removeVolunteerBreakPeriod(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
    @Query("start", ParseDatePipe) start: Date,
    @Query("end", ParseDatePipe) end: Date,
  ): Promise<PeriodDto[]> {
    const breakPeriod = Period.init({ start, end });
    return this.planning.removeBreakPeriod(volunteerId, breakPeriod);
  }
}
