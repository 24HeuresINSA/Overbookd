import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  UseFilters,
} from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResponseDto } from "./dto/configuration.response.dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import {
  Configuration,
  ConfigurationKey,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
} from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { RequestWithUserPayload } from "../../src/app.controller";
import { VolunteerAvailabilityErrorFilter } from "../volunteer-availability/volunteer-availability-error.filter";
import { PeriodRequestDto } from "../common/dto/period.request.dto";
import { Availability } from "@overbookd/volunteer-availability";

@Controller("configuration")
@ApiTags("configuration")
@ApiSwaggerResponse()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get all configurations",
    type: ConfigurationResponseDto,
    isArray: true,
  })
  findAll(@Request() req: RequestWithUserPayload): Promise<Configuration[]> {
    return this.configurationService.findAll(new JwtUtil(req.user));
  }

  @Get("unauthenticated/:key")
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get configuration by key",
    type: ConfigurationResponseDto,
  })
  findOne(
    @Param("key") key: ConfigurationKey,
    @Request() req: RequestWithUserPayload,
  ): Promise<Configuration> {
    return this.configurationService.findOne(key, new JwtUtil(req.user));
  }

  @Post(VOLUNTEER_BRIEFING_TIME_WINDOW_KEY)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
    @Request() req: RequestWithUserPayload,
  ): Promise<Configuration> {
    Availability.fromPeriod(period);
    const config = {
      key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
      value: period,
    };
    return this.configurationService.upsert(config, new JwtUtil(req.user));
  }

  @Post(":key")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
    @Request() req: RequestWithUserPayload,
  ): Promise<Configuration> {
    return this.configurationService.upsert(
      { key, value },
      new JwtUtil(req.user),
    );
  }
}
