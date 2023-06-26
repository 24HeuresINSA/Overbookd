import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FaElectricityNeedsService } from './fa_electricity_needs.service';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { FaElectricityNeed } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-electricity-needs')
export class FaElectricityNeedsController {
  constructor(
    private readonly faElectricityNeedsService: FaElectricityNeedsService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateFaElectricityNeedDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<FaElectricityNeed[] | null> {
    return this.faElectricityNeedsService.upsert(
      +faID,
      createFaElectricityNeedDto,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<FaElectricityNeed[] | null> {
    return this.faElectricityNeedsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FaElectricityNeed | null> {
    return this.faElectricityNeedsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FaElectricityNeed> {
    return this.faElectricityNeedsService.remove(+id);
  }
}
