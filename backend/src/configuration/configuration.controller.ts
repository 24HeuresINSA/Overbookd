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
import { UpdateConfigurationDto } from './dto/updateConfiguration.dto';
import { Configuration } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  create(@Body() configurationData: Configuration) {
    return this.configurationService.create(configurationData);
  }

  @Get()
  findAll() {
    return this.configurationService.configurations({});
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.configurationService.findOne(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('hard')
  @Patch()
  update(@Body() updateConfigurationDto: Configuration) {
    const param = {
      where: { key: updateConfigurationDto.key },
      data: updateConfigurationDto,
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
