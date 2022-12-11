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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { FaSignaNeedsService } from './fa_signa_needs.service';
import { Permissions } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-signa-needs')
export class FaSignaNeedsController {
  constructor(private readonly faSignaNeedsService: FaSignaNeedsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateFaSignaNeedDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ) {
    return this.faSignaNeedsService.upsert(+faID, createFaSignaNeedDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Get()
  findAll() {
    return this.faSignaNeedsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faSignaNeedsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('hard')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faSignaNeedsService.remove(+id);
  }
}
