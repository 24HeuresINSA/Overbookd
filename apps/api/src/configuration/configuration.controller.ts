import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationResponseDto } from './dto/configurationResponse.dto';
import { Configuration } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from '../auth/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/permissions-auth.guard';
import { ConfigurationValue } from './configuration.model';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all configurations',
    type: Promise<ConfigurationResponseDto[]>,
  })
  findAll(): Promise<Configuration[]> {
    return this.configurationService.findAll();
  }

  @Get(':key')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get configuration by key',
  })
  findOne(@Param('key') key: string): Promise<Configuration> {
    return this.configurationService.findOne(key);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('manage-config')
  @Post(':key')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Upsert configuration',
  })
  @ApiBody({
    description: 'Upsert Configuration',
    type: ConfigurationResponseDto,
  })
  upsert(
    @Param('key') key: string,
    @Body() configurationValue: ConfigurationValue,
  ): Promise<Configuration> {
    return this.configurationService.upsert(key, configurationValue);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('admin')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a configurations',
  })
  @ApiParam({
    name: 'key',
    description: 'Configuration key',
  })
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configurationService.remove(key);
  }
}
