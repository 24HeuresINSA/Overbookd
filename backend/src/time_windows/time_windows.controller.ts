import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TimeWindowsService } from './time_windows.service';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { time_windows } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('time-windows')
@Controller('time-windows')
export class TimeWindowsController {
  constructor(private readonly timeWindowsService: TimeWindowsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':faID')
  @ApiBody({ type: [CreateTimeWindowDto] })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body() tWindows: CreateTimeWindowDto[],
  ): Promise<time_windows[] | null> {
    return this.timeWindowsService.upsert(+faID, tWindows);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  findAll(): Promise<time_windows[] | null> {
    return this.timeWindowsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<time_windows | null> {
    return this.timeWindowsService.findOne(+id);
  }
}
