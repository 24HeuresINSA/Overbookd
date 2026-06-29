import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { ConfigurationResponseDto } from "./dto/configuration.response.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import {
  Configuration,
  ConfigurationKey,
} from "@overbookd/configuration";
import { UpsertConfigurationDto } from "./dto/upsert-configuration.request.dto";
import { MANAGE_CONFIG } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";

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
    @Request() { user }: RequestWithUserPayload,
  ): Promise<Configuration[]> {
    return this.configurationService.findAll(new JwtUtil(user));
  }

  @Get(":key")
  @ApiResponse({
    status: 200,
    description: "Get configuration by key",
    type: ConfigurationResponseDto,
  })
  findOne(
    @Param("key") key: ConfigurationKey,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<Configuration> {
    return this.configurationService.findOne(key, new JwtUtil(user));
  }

  @Post(":key")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CONFIG)
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
    @Request() { user }: RequestWithUserPayload,
  ): Promise<Configuration> {
    return this.configurationService.upsert({ key, value }, new JwtUtil(user));
  }
}
