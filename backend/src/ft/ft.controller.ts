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
import {
  ExistingPeriodGearRequestFormRequestDto,
  GearRequestFormRequestDto,
  NewPeriodGearRequestFormRequestDto,
} from 'src/gear-requests/dto/gearRequestFormRequest.dto';
import { GearRequestResponseDto } from 'src/gear-requests/dto/gearRequestResponse.dto';
import { GearRequestsService } from 'src/gear-requests/gearRequests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFtDto } from './dto/create-ft.dto';
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
} from './dto/ft-response.dto';
import { FTSearchRequestDto } from './dto/ftSearchRequest.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { FtService } from './ft.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtController {
  constructor(
    private readonly ftService: FtService,
    private readonly gearRequestService: GearRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft has been successfully created.',
    type: CompleteFtResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(@Body() ft: CreateFtDto): Promise<CompleteFtResponseDto | null> {
    return this.ftService.create(ft);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all ft',
    isArray: true,
    type: LiteFtResponseDto,
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
  findAll(
    @Query() searchRequest: FTSearchRequestDto,
  ): Promise<LiteFtResponseDto[]> {
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
    type: CompleteFtResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'ft updated',
    type: CompleteFtResponseDto,
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
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFtDto: UpdateFtDto,
  ): Promise<CompleteFtResponseDto | null> {
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
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT id',
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.ftService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':id/gear-requests')
  @ApiResponse({
    status: 201,
    description: 'Creating a new gear request',
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Task id',
    required: true,
  })
  @ApiBody({ type: GearRequestFormRequestDto })
  addGearRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    gearRequestForm:
      | NewPeriodGearRequestFormRequestDto
      | ExistingPeriodGearRequestFormRequestDto,
  ): Promise<GearRequestResponseDto> {
    return this.gearRequestService.addTaskRequest({
      ...gearRequestForm,
      seekerId: id,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id/gear-requests')
  @ApiResponse({
    status: 200,
    description: 'Get task gear requests',
    isArray: true,
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Task id',
    required: true,
  })
  getGearRequests(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getTaskRequests(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':taskId/gear-requests/:gearId/rental-period/:rentalPeriodId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Gear request deleted',
  })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'Task id',
    required: true,
  })
  @ApiParam({
    name: 'gearId',
    type: Number,
    description: 'Gear id',
    required: true,
  })
  @ApiParam({
    name: 'rentalPeriodId',
    type: Number,
    description: 'Rental period id',
    required: true,
  })
  deleteGearRequest(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('gearId', ParseIntPipe) gearId: number,
    @Param('rentalPeriodId', ParseIntPipe) rentalPeriodId: number,
  ): Promise<void> {
    return this.gearRequestService.removeTaskRequest(
      taskId,
      gearId,
      rentalPeriodId,
    );
  }
}
