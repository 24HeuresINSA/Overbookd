import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { AvailabilitiesRequestDto } from "./dto/availabilities.request.dto";
import { PeriodResponseDto } from "../common/dto/period.response.dto";
import { VolunteerAvailabilityErrorFilter } from "./volunteer-availability-error.filter";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiBearerAuth()
@ApiTags("volunteer-availability")
@Controller("volunteer-availability")
@UseFilters(VolunteerAvailabilityErrorFilter)
@ApiSwaggerResponse()
export class VolunteerAvailabilityController {
  constructor(
    private readonly volunteerAvailabilityService: VolunteerAvailabilityService,
  ) {}

  @Post(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: "Volunteer's availability periods successfully created.",
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiBody({
    type: AvailabilitiesRequestDto,
    description: "The availability periods to add.",
  })
  @ApiParam({
    name: "userId",
    description: "The id of the user to add the availability periods to.",
    type: Number,
    required: true,
  })
  add(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() { availabilities }: AvailabilitiesRequestDto,
  ): Promise<PeriodResponseDto[]> {
    return this.volunteerAvailabilityService.addAvailabilities(
      userId,
      availabilities,
    );
  }

  @Get(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Volunteer's availability periods",
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "userId",
    description: "The id of the user to retrieve the availability periods of.",
    type: Number,
    required: true,
  })
  findOne(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<PeriodResponseDto[]> {
    return this.volunteerAvailabilityService.findUserAvailabilities(userId);
  }

  @Patch(":userId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @ApiParam({
    name: "userId",
    description: "The id of the user to add the availability periods to.",
    type: Number,
    required: true,
  })
  @ApiBody({
    type: AvailabilitiesRequestDto,
    description: "The availability periods to add.",
  })
  @ApiResponse({
    status: 201,
    description: "Volunteer's availability periods successfully created.",
    type: PeriodResponseDto,
    isArray: true,
  })
  overrideHuman(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() { availabilities }: AvailabilitiesRequestDto,
  ): Promise<PeriodResponseDto[]> {
    return this.volunteerAvailabilityService.addAvailabilitiesWithoutCheck(
      userId,
      availabilities,
    );
  }
}
