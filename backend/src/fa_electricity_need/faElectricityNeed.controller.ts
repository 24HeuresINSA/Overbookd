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
import { CreateFaElectricityNeedDto } from './dto/createFaElectricityNeed.dto';
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
  @Post(':faId')
  @ApiBody({ type: [CreateFaElectricityNeedDto] })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<FaElectricityNeed[]> {
    return this.faElectricityNeedService.upsert(
      faId,
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
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FaElectricityNeed | null> {
    return this.faElectricityNeedService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.faElectricityNeedService.remove(id);
  }
}
