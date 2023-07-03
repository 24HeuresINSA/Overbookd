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
  Request,
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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { StatsPayload } from 'src/common/services/stats.service';
import {
  ApprovedGearRequest,
  GearSeekerType,
} from 'src/gear-requests/gearRequests.model';
import { RequestWithUserPayload } from '../app.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GearRequestsApproveFormRequestDto } from '../gear-requests/dto/gearRequestApproveFormRequest.dto';
import {
  ExistingPeriodGearRequestFormRequestDto,
  GearRequestFormRequestDto,
  NewPeriodGearRequestFormRequestDto,
} from '../gear-requests/dto/gearRequestFormRequest.dto';
import {
  ApprovedGearRequestResponseDto,
  GearRequestResponseDto,
} from '../gear-requests/dto/gearRequestResponse.dto';
import { GearRequestUpdateFormRequestDto } from '../gear-requests/dto/gearRequestUpdateFormRequest.dto';
import { GearRequestsService } from '../gear-requests/gearRequests.service';
import { CompleteFaResponseDto } from './dto/completeFaResponse.dto';
import { CreateFaDto } from './dto/createFa.dto';
import { FASearchRequestDto } from './dto/faSearchRequest.dto';
import { LiteFaResponseDto } from './dto/liteFaResponse.dto';
import { UpdateFaDto } from './dto/updateFa.dto';
import { validationDto } from './dto/validation.dto';
import { CompleteFaResponse, LiteFaResponse } from './fa.model';
import { FaService } from './fa.service';
import { FaIdResponse } from './faTypes';

@ApiBearerAuth()
@ApiTags('fa')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Can't find a requested resource",
})
@Controller('fa')
export class FaController {
  constructor(
    private readonly faService: FaService,
    private readonly gearRequestService: GearRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a new fa',
    type: CompleteFaResponseDto,
  })
  create(@Body() FA: CreateFaDto): Promise<CompleteFaResponse> {
    return this.faService.create(FA);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all fa',
    isArray: true,
    type: LiteFaResponseDto,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Get FAs that are deleted',
  })
  findAll(
    @Query() searchRequest: FASearchRequestDto,
  ): Promise<LiteFaResponse[]> {
    return this.faService.findAll(searchRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('stats')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get FA stats',
    type: Promise<StatsPayload[]>,
  })
  getFaStats(): Promise<StatsPayload[]> {
    return this.faService.getFaStats();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get a fa',
    type: CompleteFaResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CompleteFaResponse> {
    return this.faService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':id')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Update a fa',
    type: CompleteFaResponseDto,
  })
  @ApiBody({
    description: 'Update a fa',
    type: UpdateFaDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaDto: UpdateFaDto,
  ): Promise<CompleteFaResponse> {
    return this.faService.update(id, updateFaDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a fa',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('fa-validator')
  @Post(':id/validation')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Validate a fa',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FA id',
    required: true,
  })
  validate(
    @Request() request: RequestWithUserPayload,
    @Body() teamId: validationDto,
    @Param('id', ParseIntPipe) faId: number,
  ): Promise<void> {
    const userId = request.user.userId ?? request.user.id;
    return this.faService.validatefa(userId, faId, teamId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('fa-validator')
  @Delete(':faId/validation/:teamId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Remove a validation of fa',
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  @ApiParam({
    name: 'teamId',
    type: Number,
    description: 'Team id',
    required: true,
  })
  removeValidation(
    @Param('faId', ParseIntPipe) faId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<void> {
    return this.faService.removeFaValidation(faId, teamId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('fa-validator')
  @Post(':id/refusal')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Refuse a fa',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FA id',
    required: true,
  })
  refuse(
    @Request() request: RequestWithUserPayload,
    @Body() validationForm: validationDto,
    @Param('id', ParseIntPipe) faId: number,
  ): Promise<void> {
    const userId = request.user.userId ?? request.user.id;
    return this.faService.refusefa(userId, faId, validationForm);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id/previous')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get the previous fa',
    type: Promise<FaIdResponse | null>,
  })
  findPrevious(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FaIdResponse | null> {
    return this.faService.findPrevious(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id/next')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get the next fa',
    type: Promise<FaIdResponse | null>,
  })
  findNext(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FaIdResponse | null> {
    return this.faService.findNext(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':id/gear-requests')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Creating a new gear request',
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Animation id',
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
    return this.gearRequestService.addAnimationRequest({
      ...gearRequestForm,
      seekerId: id,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id/gear-requests')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get animation gear requests',
    isArray: true,
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Animation id',
    required: true,
  })
  getGearRequests(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getAnimationRequests(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Patch(
    ':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId/approve',
  )
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Gear request approved',
    type: ApprovedGearRequestResponseDto,
  })
  @ApiParam({
    name: 'animationId',
    type: Number,
    description: 'Animation id',
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
  approveGearRequest(
    @Param('animationId', ParseIntPipe) animationId: number,
    @Param('gearId', ParseIntPipe) gearId: number,
    @Param('rentalPeriodId', ParseIntPipe) rentalPeriodId: number,
    @Body() approveForm: GearRequestsApproveFormRequestDto,
  ): Promise<ApprovedGearRequest> {
    const gearRequestId = {
      seeker: { type: GearSeekerType.Animation, id: animationId },
      gearId,
      rentalPeriodId,
    };
    const { drive } = approveForm;
    return this.gearRequestService.approveGearRequest(gearRequestId, drive);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Patch(':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update an existing gear request',
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: 'animationId',
    type: Number,
    description: 'Animation id',
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
  updateGearRequest(
    @Param('animationId', ParseIntPipe) animationId: number,
    @Param('gearId', ParseIntPipe) gearId: number,
    @Param('rentalPeriodId', ParseIntPipe) rentalPeriodId: number,
    @Body() gearRequestForm: GearRequestUpdateFormRequestDto,
  ): Promise<GearRequestResponseDto> {
    return this.gearRequestService.updateAnimationRequest(
      animationId,
      gearId,
      rentalPeriodId,
      gearRequestForm,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Gear request deleted',
  })
  @ApiParam({
    name: 'animationId',
    type: Number,
    description: 'Animation id',
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
    @Param('animationId', ParseIntPipe) animationId: number,
    @Param('gearId', ParseIntPipe) gearId: number,
    @Param('rentalPeriodId', ParseIntPipe) rentalPeriodId: number,
  ): Promise<void> {
    return this.gearRequestService.removeAnimationRequest(
      animationId,
      gearId,
      rentalPeriodId,
    );
  }
}
