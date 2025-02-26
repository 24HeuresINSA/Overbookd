import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResponseDto } from "./dto/configuration.response.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import {
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  Configuration,
  ConfigurationKey,
} from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";
import { ENROLL_SOFT, MANAGE_CONFIG } from "@overbookd/permission";
import { PeriodRequestDto } from "../common/dto/period.request.dto";
import { IProvidePeriod } from "@overbookd/time";

@ApiTags("configuration")
@Controller("configuration")
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all configurations",
    type: ConfigurationResponseDto,
    isArray: true,
  })
  findAll(): Promise<Configuration[]> {
    return this.configurationService.findAll();
  }

  @Get(":key")
  @ApiResponse({
    status: 200,
    description: "Get configuration by key",
    type: ConfigurationResponseDto,
  })
  findOne(@Param("key") key: ConfigurationKey): Promise<Configuration> {
    return this.configurationService.findOne(key);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(ENROLL_SOFT)
  @Post(VOLUNTEER_BRIEFING_TIME_WINDOW_KEY)
  @ApiResponse({
    status: 201,
    description: "Upsert briefing time window",
    type: ConfigurationResponseDto,
  })
  @ApiBody({
    description: "Briefing time window",
    type: PeriodRequestDto,
  })
  upsertBriefingTimeWindow(
    @Body() briefingTimeWindow: IProvidePeriod,
  ): Promise<Configuration> {
    return this.configurationService.upsert({
      key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
      value: briefingTimeWindow,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONFIG)
  @Post(":key")
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
  ): Promise<Configuration> {
    return this.configurationService.upsert({ key, value });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONFIG)
  @Delete(":key")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a configuration",
  })
  @ApiParam({
    name: "key",
    description: "Configuration key",
  })
  remove(@Param("key") key: ConfigurationKey): Promise<void> {
    return this.configurationService.remove(key);
  }
}
