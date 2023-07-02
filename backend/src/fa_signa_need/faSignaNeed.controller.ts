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
import { ExportSignaNeeds as ExportSignaNeed } from 'src/fa/faTypes';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  @Post(':faID')
  @ApiBody({
    type: CreateFaSignaNeedDto,
    isArray: true,
  })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ) {
    return this.faSignaNeedService.upsert(+faID, createFaSignaNeedDto);
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
  findOne(@Param('id') id: string) {
    return this.faSignaNeedService.findOne(+id);
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
  remove(@Param('id') id: string) {
    return this.faSignaNeedService.remove(+id);
  }
}
