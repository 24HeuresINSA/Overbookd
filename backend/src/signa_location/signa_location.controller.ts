import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
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
  @Permission('manage-location')
  @Post()
  create(@Body() createSignaLocationDto: CreateSignaLocationDto) {
    return this.signaLocationService.create(createSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll() {
    return this.signaLocationService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.signaLocationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('orga')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSignaLocationDto: UpdateSignaLocationDto,
  ) {
    return this.signaLocationService.update(id, updateSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-location')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.signaLocationService.remove(id);
  }
}
