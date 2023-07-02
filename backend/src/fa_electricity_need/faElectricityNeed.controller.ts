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
import { FaElectricityNeed } from '@prisma/client';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';
import { FaElectricityNeedService } from './faElectricityNeed.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-electricity-needs')
export class FaElectricityNeedController {
  constructor(
    private readonly faElectricityNeedService: FaElectricityNeedService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateFaElectricityNeedDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<FaElectricityNeed[]> {
    return this.faElectricityNeedService.upsert(
      +faID,
      createFaElectricityNeedDto,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<FaElectricityNeed[]> {
    return this.faElectricityNeedService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FaElectricityNeed | null> {
    return this.faElectricityNeedService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.faElectricityNeedService.remove(+id);
  }
}
