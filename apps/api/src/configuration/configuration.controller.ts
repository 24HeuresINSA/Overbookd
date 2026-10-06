import { Controller, Get, Post, Body, Param, UseFilters } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResponseDto } from "./dto/configuration.response.dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Configuration, ConfigurationKey } from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { VolunteerAvailabilityErrorFilter } from "../volunteer-availability/volunteer-availability-error.filter";
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
