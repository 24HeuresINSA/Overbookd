import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/createConfiguration.dto';
import { Configuration } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Return created Configuration',
  })
  @ApiBody({
    description: 'Create Configuration',
    type: CreateConfigurationDto,
  })
  create(@Body() configurationData: Configuration) {
    return this.configurationService.create(configurationData);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all configurations',
    type: Array,
  })
  findAll() {
    return this.configurationService.configurations({});
  }

  @Get(':key')
  @ApiResponse({
    status: 200,
    description: 'Get configuration by key',
  })
  findOne(@Param('key') key: string) {
    return this.configurationService.findOne(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('hard')
  @Patch()
  @ApiResponse({
    status: 200,
    description: 'Patch configuration',
  })
  @ApiBody({
    description: 'update Configuration',
    type: CreateConfigurationDto,
  })
  update(@Body() configuration: Configuration) {
    const param = {
      where: { key: configuration.key },
      data: configuration,
    };
    return this.configurationService.update(param);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configurationService.remove(key);
  }
}
