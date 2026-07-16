import { Controller, Get, Post, Body, Param, UseFilters } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResponseDto } from "./dto/configuration.response.dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Configuration,
  ConfigurationKey,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
} from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { VolunteerAvailabilityErrorFilter } from "../volunteer-availability/volunteer-availability-error.filter";
import { PeriodRequestDto } from "../common/dto/period.request.dto";
import { Availability } from "@overbookd/volunteer-availability";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { Public } from "../authentication-zitadel/decorators/public.decorator";

@Controller("configuration")
@ApiTags("configuration")
@ApiSwaggerResponse()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all configurations",
    type: ConfigurationResponseDto,
    isArray: true,
  })
  findAll(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<Configuration[]> {
    return this.configurationService.findAll(user);
  }

  @Get("unauthenticated/:key")
  @Public()
  @ApiResponse({
    status: 200,
    description: "Get configuration by key",
    type: ConfigurationResponseDto,
  })
  findOneAsUnauthenticated(
    @Param("key") key: ConfigurationKey,
  ): Promise<Configuration> {
    return this.configurationService.findOne(key);
  }

  @Get(":key")
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get configuration by key",
    type: ConfigurationResponseDto,
  })
  findOne(
    @Param("key") key: ConfigurationKey,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<Configuration> {
    return this.configurationService.findOne(key, user);
  }

  @Post(VOLUNTEER_BRIEFING_TIME_WINDOW_KEY)
  @ApiBearerAuth()
  @UseFilters(VolunteerAvailabilityErrorFilter)
  @ApiResponse({
    status: 201,
    description: "Upsert briefing time window",
  })
  @ApiBody({
    description: "Briefing time window",
    type: PeriodRequestDto,
  })
  upsertBriefingTimeWindow(
    @Body() period: PeriodRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<Configuration> {
    Availability.fromPeriod(period);
    const config = {
      key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
      value: period,
    };
    return this.configurationService.upsert(config, user);
  }

  @Post(":key")
  @ApiBearerAuth()
  @UseFilters(VolunteerAvailabilityErrorFilter)
  @ApiResponse({
    status: 201,
    description: "Upsert configuration",
    type: ConfigurationResponseDto,
  })
  @ApiBody({
    description: "Upsert Configuration",
    type: UpsertConfigurationDto,
  })
  upsert(
    @Param("key") key: ConfigurationKey,
    @Body() { value }: UpsertConfigurationDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<Configuration> {
    return this.configurationService.upsert({ key, value }, user);
  }
}
