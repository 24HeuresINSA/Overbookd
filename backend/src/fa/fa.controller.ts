import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { FaService } from './fa.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fa } from '@prisma/client';
import { RequestWithUserPayload } from '../app.controller';
import { FaResponse, AllFaResponse } from './fa_types';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa')
export class FaController {
  constructor(private readonly faService: FaService) {}

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
  findAll(): Promise<AllFaResponse[] | null> {
    return this.faService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a fa',
    type: Promise<fa | null>,
  })
  findOne(@Param('id', ParseIntPipe) id: string): Promise<FaResponse | null> {
    return this.faService.findOne(+id);
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
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFaDto: UpdateFaDto,
  ): Promise<FaResponse | null> {
    return this.faService.update(+id, updateFaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete a fa',
    type: Promise<fa | null>,
  })
  remove(@Param('id', ParseIntPipe) id: string): Promise<fa | null> {
    return this.faService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Post('validate')
  @ApiResponse({
    status: 201,
    description: 'Validate a fa',
    type: Promise<fa | null>,
  })
  //get id and user id from token
  validate(
    @Request() request: RequestWithUserPayload,
    @Body() validationdto: validationDto,
  ): Promise<fa | null> {
    const user_id = request.user.id;
    return this.faService.validatefa(user_id, validationdto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Post('invalidate')
  @ApiResponse({
    status: 204,
    description: 'Unvalidate a fa',
    type: Promise<fa | null>,
  })
  invalidate(
    @Request() request: RequestWithUserPayload,
    @Body() validationdto: validationDto,
  ): Promise<fa | null> {
    const user_id = request.user.id;
    return this.faService.invalidatefa(user_id, validationdto);
  }
}
