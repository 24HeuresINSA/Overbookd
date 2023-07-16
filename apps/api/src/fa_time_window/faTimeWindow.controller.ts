import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FaTimeWindow } from '@prisma/client';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { CreateTimeWindowDto } from './dto/createFaTimeWindow.dto';
import { FaTimeWindowService } from './faTimeWindow.service';
import { FaTimeWindowRepresentation } from '../fa/fa.model';

@ApiBearerAuth()
@ApiTags('time-windows')
@Controller('time-windows')
export class FaTimeWindowController {
  constructor(private readonly faTimeWindowService: FaTimeWindowService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId')
  @ApiBody({ type: CreateTimeWindowDto, isArray: true })
  @ApiResponse({ status: 201, isArray: true, type: FaTimeWindowRepresentation })
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
  @ApiResponse({ status: 200, isArray: true, type: FaTimeWindowRepresentation })
  findAll(): Promise<FaTimeWindow[]> {
    return this.faTimeWindowService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @ApiResponse({ status: 200, type: FaTimeWindowRepresentation })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FaTimeWindow | null> {
    return this.faTimeWindowService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.faTimeWindowService.remove(id);
  }
}
