import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { TimeWindowsService } from './time_windows.service';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FaTimeWindow } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('time-windows')
@Controller('time-windows')
export class TimeWindowsController {
  constructor(private readonly timeWindowsService: TimeWindowsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faID')
  @ApiBody({ type: CreateTimeWindowDto, isArray: true })
  upsert(
    @Param('faID', ParseIntPipe) faID: string,
    @Body(
      new ParseArrayPipe({
        items: CreateTimeWindowDto,
        whitelist: true,
      }),
    )
    tWindows: CreateTimeWindowDto[],
  ): Promise<FaTimeWindow[] | null> {
    return this.timeWindowsService.upsert(+faID, tWindows);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<FaTimeWindow[] | null> {
    return this.timeWindowsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FaTimeWindow | null> {
    return this.timeWindowsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FaTimeWindow | null> {
    return this.timeWindowsService.remove(+id);
  }
}
