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
import { CreateTimeWindowDto } from './dto/createFaTimeWindow.dto';
import { FaTimeWindowService } from './faTimeWindow.service';

@ApiBearerAuth()
@ApiTags('time-windows')
@Controller('time-windows')
export class FaTimeWindowController {
  constructor(private readonly faTimeWindowService: FaTimeWindowService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId')
  @ApiBody({ type: CreateTimeWindowDto, isArray: true })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body(
      new ParseArrayPipe({
        items: CreateTimeWindowDto,
        whitelist: true,
      }),
    )
    tWindows: CreateTimeWindowDto[],
  ): Promise<FaTimeWindow[]> {
    return this.faTimeWindowService.upsert(faId, tWindows);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<FaTimeWindow[]> {
    return this.faTimeWindowService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FaTimeWindow | null> {
    return this.faTimeWindowService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.faTimeWindowService.remove(id);
  }
}
