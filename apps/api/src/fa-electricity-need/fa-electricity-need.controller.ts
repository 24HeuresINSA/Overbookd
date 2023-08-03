import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FaElectricityNeed } from '@prisma/client';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { CreateFaElectricityNeedRequestDto } from './dto/create-fa-electricity-need.request.dto';
import { FaElectricityNeedService } from './fa-electricity-need.service';
import { FaElectricityNeedRepresentation } from '../fa/fa.model';

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
  @ApiBody({ type: CreateFaElectricityNeedRequestDto, isArray: true })
  @ApiResponse({
    status: 201,
    type: FaElectricityNeedRepresentation,
    isArray: true,
  })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createFaElectricityNeedDto: CreateFaElectricityNeedRequestDto[],
  ): Promise<FaElectricityNeed[]> {
    return this.faElectricityNeedService.upsert(
      faId,
      createFaElectricityNeedDto,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    type: FaElectricityNeedRepresentation,
    isArray: true,
  })
  findAll(): Promise<FaElectricityNeed[]> {
    return this.faElectricityNeedService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @ApiResponse({ status: 200, type: FaElectricityNeedRepresentation })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FaElectricityNeed | null> {
    return this.faElectricityNeedService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.faElectricityNeedService.remove(id);
  }
}
