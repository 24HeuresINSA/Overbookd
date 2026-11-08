import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { VolunteerAvailabilityService } from "./volunteer-availability.service";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { AvailabilitiesRequestDto } from "./dto/availabilities.request.dto";
import { CreateOverClicScoreRequestDto } from "./dto/create-overclic-score.request.dto";
import { OverClicScoreResponseDto } from "./dto/overclic-score.response.dto";
import { PeriodResponseDto } from "../common/dto/period.response.dto";
import { VolunteerAvailabilityErrorFilter } from "./volunteer-availability-error.filter";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Controller("volunteer-availability")
@ApiTags("volunteer-availability")
@UseFilters(VolunteerAvailabilityErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class VolunteerAvailabilityController {
  constructor(
    private readonly volunteerAvailabilityService: VolunteerAvailabilityService,
  ) {}

  @Get("overclic/scores")
  @ApiResponse({
    status: 200,
    description: "Get the OverClic high scores",
    isArray: true,
    type: OverClicScoreResponseDto,
  })
  findOverClicHighScores(): Promise<OverClicScoreResponseDto[]> {
    return this.volunteerAvailabilityService.findOverClicHighScores();
  }

  @Post("overclic/scores")
  @ApiResponse({
    status: 201,
    description: "Save an OverClic score and get the high scores",
    isArray: true,
    type: OverClicScoreResponseDto,
  })
  @ApiBody({
    description: "The score achieved on OverClic",
    type: CreateOverClicScoreRequestDto,
  })
  saveOverClicScore(
    @Body() score: CreateOverClicScoreRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OverClicScoreResponseDto[]> {
    return this.volunteerAvailabilityService.saveOverClicScore(user.id, score);
  }

  @Post(":userId")
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
  @Permissions(AFFECT_VOLUNTEER)
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
  overrideAvailabilities(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() { availabilities }: AvailabilitiesRequestDto,
  ): Promise<PeriodResponseDto[]> {
    return this.volunteerAvailabilityService.addAvailabilitiesWithoutCheck(
      userId,
      availabilities,
    );
  }
}
