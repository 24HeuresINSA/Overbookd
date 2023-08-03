import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { CreateFaSignaNeedRequestDto } from './dto/create-fa-signa-need.request.dto';
import { FaSignaNeedExportCsvResponseDto } from './dto/fa-signa-need-export-csv.response.dto';
import { FaSignaNeedService } from './fa-signa-need.service';
import { FaSignaNeedRepresentation } from '../fa/fa.model';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-signa-needs')
export class FaSignaNeedController {
  constructor(private readonly faSignaNeedService: FaSignaNeedService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId')
  @ApiBody({
    type: CreateFaSignaNeedRequestDto,
    isArray: true,
  })
  @ApiResponse({ status: 201, type: FaSignaNeedRepresentation })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedRequestDto[],
  ) {
    return this.faSignaNeedService.upsert(faId, createFaSignaNeedDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({ status: 200, isArray: true, type: FaSignaNeedRepresentation })
  findAll() {
    return this.faSignaNeedService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({ status: 200, type: FaSignaNeedRepresentation })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faSignaNeedService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('export-csv')
  @ApiResponse({
    status: 200,
    description: 'All signaNeeds for export',
    type: FaSignaNeedExportCsvResponseDto,
    isArray: true,
  })
  findSignaNeedsForExport(): Promise<ExportSignaNeed[]> {
    return this.faSignaNeedService.findSignaNeedsForExport();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faSignaNeedService.remove(id);
  }
}
