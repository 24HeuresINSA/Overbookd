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
import { fa } from '@prisma/client';
import { RequestWithUserPayload } from '../app.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { RolesGuard } from '../auth/team-auth.guard';
import { CreateFaDto } from './dto/create-fa.dto';
import { FASearchRequestDto } from './dto/faSearchRequest.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';
import { FaService } from './fa.service';
import { AllFaResponse, FaResponse } from './fa_types';
import { GearRequestsApproveFormRequestDto } from './gear-requests/dto/gearRequestApproveFormRequest.dto';
import {
  ExistingPeriodGearRequestFormRequestDto,
  GearRequestFormRequestDto,
  NewPeriodGearRequestFormRequestDto,
} from './gear-requests/dto/gearRequestFormRequest.dto';
import {
  ApprovedGearRequestResponseDto,
  GearRequestResponseDto,
} from './gear-requests/dto/gearRequestResponse.dto';
import { GearRequestUpdateFormRequestDto } from './gear-requests/dto/gearRequestUpdateFormRequest.dto';
import {
  ApprovedGearRequest,
  GearRequestsService,
  GearSeekerType,
} from './gear-requests/gearRequests.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa')
export class FaController {
  constructor(
    private readonly faService: FaService,
    private readonly gearRequestService: GearRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a new fa',
    type: Promise<fa | null>,
  })
  create(@Body() FA: CreateFaDto): Promise<FaResponse | null> {
    return this.faService.create(FA);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all fa',
    type: Array,
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Get FAs that are deleted',
  })
  findAll(
    @Query() searchRequest: FASearchRequestDto,
  ): Promise<AllFaResponse[] | null> {
    return this.faService.findAll(searchRequest);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a fa',
    type: Promise<fa | null>,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FaResponse | null> {
    return this.faService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':id')
  @ApiResponse({
    status: 201,
    description: 'Update a fa',
    type: Promise<fa | null>,
  })
  @ApiBody({
    description: 'Update a fa',
    type: UpdateFaDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaDto: UpdateFaDto,
  ): Promise<FaResponse | null> {
    return this.faService.update(id, updateFaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete a fa',
    type: Promise<fa | null>,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<fa | null> {
    return this.faService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Post(':id/validation')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Validate a fa',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "Can't find a requested resource",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FA id',
    required: true,
  })
  validate(
    @Request() request: RequestWithUserPayload,
    @Body() team_id: validationDto,
    @Param('id', ParseIntPipe) faid: number,
  ): Promise<void> {
    const user_id = request.user.id;
    return this.faService.validatefa(user_id, faid, team_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Delete(':faId/validation/:teamId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Remove a validation of fa',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "Can't find a requested resource",
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Post(':id/refusal')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Refuse a fa',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "Can't find a requested resource",
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
    @Param('id', ParseIntPipe) faid: number,
  ): Promise<void> {
    const userId = request.user.id;
    return this.faService.refusefa(userId, faid, validationForm);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':id/gear-requests')
  @ApiResponse({
    status: 201,
    description: 'Creating a new gear request',
    type: GearRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id/gear-requests')
  @ApiResponse({
    status: 200,
    description: 'Get animation gear requests',
    isArray: true,
    type: GearRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Patch(
    ':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId/approve',
  )
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Gear request approved',
    type: ApprovedGearRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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
    return this.gearRequestService.approveAnimationGearRequest(
      gearRequestId,
      drive,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Patch(':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId')
  @ApiResponse({
    status: 200,
    description: 'Update an existing gear request',
    type: GearRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':animationId/gear-requests/:gearId/rental-period/:rentalPeriodId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Gear request deleted',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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
