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
import { ConfigurationValue } from "./configuration.model";
import { Configuration } from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";

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
  findOne(@Param("key") key: string): Promise<Configuration> {
    return this.configurationService.findOne(key);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission("manage-config")
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
    @Param("key") key: string,
    @Body() configurationValue: ConfigurationValue,
  ): Promise<Configuration> {
    return this.configurationService.upsert(key, configurationValue);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission("manage-config")
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
  remove(@Param("key") key: string) {
    return this.configurationService.remove(key);
  }
}
