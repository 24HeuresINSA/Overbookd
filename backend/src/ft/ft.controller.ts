import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FtStatus } from '@prisma/client';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFtDto } from './dto/create-ft.dto';
import { AllFtResponseDto, FtResponseDto } from './dto/ft-response.dto';
import { FTSearchRequestDto } from './dto/ftSearchRequest.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { FtService } from './ft.service';

@ApiBearerAuth()
@ApiTags('ft')
@Controller('ft')
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft has been successfully created.',
    type: FtResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(@Body() ft: CreateFtDto): Promise<FtResponseDto | null> {
    return this.ftService.create(ft);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all ft',
    isArray: true,
    type: AllFtResponseDto,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Get FTs that are deleted',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: FtStatus,
    description: 'Get FTs with a specific status',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  findAll(
    @Query() searchRequest: FTSearchRequestDto,
  ): Promise<AllFtResponseDto[]> {
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
    type: FtResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FtResponseDto | null> {
    return this.ftService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'ft updated',
    type: FtResponseDto,
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
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFtDto: UpdateFtDto,
  ): Promise<FtResponseDto | null> {
    return this.ftService.update(id, updateFtDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'ft deleted',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT id',
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.ftService.remove(id);
  }
}
