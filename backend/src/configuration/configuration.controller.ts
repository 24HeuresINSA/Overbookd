import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/createConfiguration.dto';
import { Configuration } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { UpdateConfigurationDto } from './dto/updateConfigurationDto';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('admin')
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Return created Configuration',
  })
  @ApiBody({
    description: 'Create Configuration',
    type: CreateConfigurationDto,
  })
  create(
    @Body() configurationData: CreateConfigurationDto,
  ): Promise<Configuration> {
    return this.configurationService.create(configurationData);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all configurations',
    type: Array,
  })
  findAll(): Promise<Configuration[]> {
    return this.configurationService.configurations({});
  }

  @Get(':key')
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
  @Put(':key')
  @ApiResponse({
    status: 200,
    description: 'Upsert configuration',
  })
  @ApiBody({
    description: 'update Configuration',
    type: CreateConfigurationDto,
  })
  update(
    @Body() configuration: UpdateConfigurationDto,
    @Param('key') key: string,
  ): Promise<Configuration> {
    const param = {
      where: { key: key },
      data: {
        key: key,
        value: configuration.value,
      },
    };
    return this.configurationService.upsert(param);
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
