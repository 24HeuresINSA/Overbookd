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
import { Roles } from '../auth/team-auth.decorator';
import { RolesGuard } from '../auth/team-auth.guard';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { FaSignaNeedsService } from './fa_signa_needs.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-signa-needs')
export class FaSignaNeedsController {
  constructor(private readonly faSignaNeedsService: FaSignaNeedsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateFaSignaNeedDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ) {
    return this.faSignaNeedsService.upsert(+faID, createFaSignaNeedDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  findAll() {
    return this.faSignaNeedsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faSignaNeedsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faSignaNeedsService.remove(+id);
  }
}
