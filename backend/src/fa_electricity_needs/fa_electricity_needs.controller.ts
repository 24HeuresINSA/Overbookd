import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FaElectricityNeedsService } from './fa_electricity_needs.service';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { fa_electricity_needs } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('fa_electricity_needs')
@Controller('fa-electricity-needs')
export class FaElectricityNeedsController {
  constructor(
    private readonly faElectricityNeedsService: FaElectricityNeedsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateFaElectricityNeedDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<fa_electricity_needs[] | null> {
    return this.faElectricityNeedsService.upsert(
      +faID,
      createFaElectricityNeedDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  findAll(): Promise<fa_electricity_needs[] | null> {
    return this.faElectricityNeedsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<fa_electricity_needs | null> {
    return this.faElectricityNeedsService.findOne(+id);
  }
}
