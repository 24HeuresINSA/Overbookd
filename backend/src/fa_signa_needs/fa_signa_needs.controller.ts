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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { ExportSignaNeeds } from 'src/fa/faTypes';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { FaSignaNeedsExportCsvDto } from './dto/exportSignaNeedsCsv.dto';
import { FaSignaNeedsService } from './fa_signa_needs.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-signa-needs')
export class FaSignaNeedsController {
  constructor(private readonly faSignaNeedsService: FaSignaNeedsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faID')
  @ApiBody({
    type: CreateFaSignaNeedDto,
    isArray: true,
  })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ) {
    return this.faSignaNeedsService.upsert(+faID, createFaSignaNeedDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll() {
    return this.faSignaNeedsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id(\\d+)')
  @ApiParam({
    name: 'id',
    type: Number,
  })
  findOne(@Param('id') id: string) {
    return this.faSignaNeedsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('export-csv')
  @ApiResponse({
    status: 200,
    description: 'All signaNeeds for export',
    type: FaSignaNeedsExportCsvDto,
    isArray: true,
  })
  findSignaNeedsForExport(): Promise<ExportSignaNeeds[]> {
    return this.faSignaNeedsService.findSignaNeedsForExport();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faSignaNeedsService.remove(+id);
  }
}
