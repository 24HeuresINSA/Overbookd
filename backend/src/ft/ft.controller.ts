import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Ft } from '@prisma/client';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFtDto } from './dto/create-ft.dto';
import { FTSearchRequestDto } from './dto/ftSearchRequest.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { FtService } from './ft.service';
import { AllFtResponse, FtResponse } from './ftTypes';

@ApiBearerAuth()
@ApiTags('ft')
@Controller('ft')
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The ft has been successfully created.',
    type: Promise<Ft | null>,
  })
  create(@Body() ft: CreateFtDto): Promise<FtResponse | null> {
    return this.ftService.create(ft);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all ft',
    type: Promise<Ft[] | null>,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Get FTs that are deleted',
  })
  findAll(
    @Query() searchRequest: FTSearchRequestDto,
  ): Promise<AllFtResponse[] | null> {
    return this.ftService.findAll(searchRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Get ft by id',
    type: Promise<Ft | null>,
  })
  findOne(@Param('id', ParseIntPipe) id: string): Promise<FtResponse | null> {
    return this.ftService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'ft updated',
    type: Promise<Ft | null>,
  })
  @ApiBody({
    description: 'Updated ft',
    type: UpdateFtDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT id',
    required: true,
  })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFtDto: UpdateFtDto,
  ): Promise<FtResponse | null> {
    return this.ftService.update(+id, updateFtDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'ft deleted',
    type: Promise<Ft | null>,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT id',
    required: true,
  })
  remove(@Param('id') id: string): Promise<Ft | null> {
    return this.ftService.remove(+id);
  }
}
