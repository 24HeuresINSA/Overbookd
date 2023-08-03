import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { CreateSignaLocationDto } from './dto/create-signa_location.dto';
import { UpdateSignaLocationDto } from './dto/update-signa_location.dto';
import { SignaLocationService } from './signa_location.service';
import { SignaLocationRepresentation } from '../fa/fa.model';

@ApiBearerAuth()
@ApiTags('signa-location')
@Controller('signa-location')
export class SignaLocationController {
  constructor(private readonly signaLocationService: SignaLocationService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-location')
  @Post()
  @ApiBody({
    type: CreateSignaLocationDto,
  })
  @ApiResponse({
    status: 201,
    type: SignaLocationRepresentation,
  })
  create(@Body() createSignaLocationDto: CreateSignaLocationDto) {
    return this.signaLocationService.create(createSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    isArray: true,
    type: SignaLocationRepresentation,
  })
  findAll() {
    return this.signaLocationService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: SignaLocationRepresentation,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.signaLocationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('orga')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: SignaLocationRepresentation,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSignaLocationDto: UpdateSignaLocationDto,
  ) {
    return this.signaLocationService.update(id, updateSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-location')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.signaLocationService.remove(id);
  }
}
