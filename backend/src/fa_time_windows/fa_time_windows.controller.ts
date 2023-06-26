import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FaTimeWindow } from '@prisma/client';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTimeWindowDto } from './dto/create-fa_time_window.dto';
import { FaTimeWindowsService } from './fa_time_windows.service';

@ApiBearerAuth()
@ApiTags('time-windows')
@Controller('time-windows')
export class FaTimeWindowsController {
  constructor(private readonly faTimeWindowsService: FaTimeWindowsService) {}

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
    return this.faTimeWindowsService.upsert(+faID, tWindows);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<FaTimeWindow[] | null> {
    return this.faTimeWindowsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FaTimeWindow | null> {
    return this.faTimeWindowsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FaTimeWindow | null> {
    return this.faTimeWindowsService.remove(+id);
  }
}
