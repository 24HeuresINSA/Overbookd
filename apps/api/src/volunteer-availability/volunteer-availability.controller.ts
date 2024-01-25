import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PeriodDto } from "./dto/period.dto";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { AvailabilitiesRequestDto } from "./dto/availabilities.dto";

@ApiBearerAuth()
@ApiTags("volunteer-availability")
@ApiBadRequestResponse({
  description: "Request is not formated as expected.",
})
@ApiForbiddenResponse({
  description: "User is not allowed to access this resource.",
})
@Controller("volunteer-availability")
export class VolunteerAvailabilityController {
  constructor(
    private readonly volunteerAvailabilityService: VolunteerAvailabilityService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(":userId")
  @ApiResponse({
    status: 201,
    description: "Volunteer's availability periods successfully created.",
    type: PeriodDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "User not found.",
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
  ): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.addAvailabilities(
      userId,
      availabilities,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  @ApiResponse({
    status: 200,
    description: "Volunteer's availability periods",
    type: PeriodDto,
    isArray: true,
  })
  @ApiParam({
    name: "userId",
    description: "The id of the user to retrieve the availability periods of.",
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({
    description: "User not found.",
  })
  findOne(@Param("userId", ParseIntPipe) userId: number): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.findUserAvailabilities(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @Patch(":userId")
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
    type: PeriodDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "User not found.",
  })
  overrideHuman(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() { availabilities }: AvailabilitiesRequestDto,
  ): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.addAvailabilitiesWithoutCheck(
      userId,
      availabilities,
    );
  }
}
