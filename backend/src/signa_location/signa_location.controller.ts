import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { CreateSignaLocationDto } from './dto/create-signa_location.dto';
import { UpdateSignaLocationDto } from './dto/update-signa_location.dto';
import { SignaLocationService } from './signa_location.service';

@ApiBearerAuth()
@ApiTags('signa-location')
@Controller('signa-location')
export class SignaLocationController {
  constructor(private readonly signaLocationService: SignaLocationService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage-location')
  @Post()
  create(@Body() createSignaLocationDto: CreateSignaLocationDto) {
    return this.signaLocationService.create(createSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Get()
  findAll() {
    return this.signaLocationService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signaLocationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('orga')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSignaLocationDto: UpdateSignaLocationDto,
  ) {
    return this.signaLocationService.update(+id, updateSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage-location')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signaLocationService.remove(+id);
  }
}
