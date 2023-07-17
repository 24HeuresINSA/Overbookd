import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { ExportSignaNeed } from '../fa/faTypes';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { CreateFaSignaNeedDto } from './dto/createFaSignaNeed.dto';
import { FaSignaNeedExportCsvDto } from './dto/exportSignaNeedCsv.dto';
import { FaSignaNeedService } from './faSignaNeed.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-signa-needs')
export class FaSignaNeedController {
  constructor(private readonly faSignaNeedService: FaSignaNeedService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId')
  @ApiBody({
    type: CreateFaSignaNeedDto,
    isArray: true,
  })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ) {
    return this.faSignaNeedService.upsert(faId, createFaSignaNeedDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll() {
    return this.faSignaNeedService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id(\\d+)')
  @ApiParam({
    name: 'id',
    type: Number,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faSignaNeedService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('export-csv')
  @ApiResponse({
    status: 200,
    description: 'All signaNeeds for export',
    type: FaSignaNeedExportCsvDto,
    isArray: true,
  })
  findSignaNeedsForExport(): Promise<ExportSignaNeed[]> {
    return this.faSignaNeedService.findSignaNeedsForExport();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faSignaNeedService.remove(id);
  }
}
