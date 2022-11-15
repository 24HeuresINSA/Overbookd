import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { FaService } from './fa.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FA } from '@prisma/client';
import { RequestWithUserPayload } from '../app.controller';

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
    type: Promise<FA | null>,
  })
  create(@Body() FA: CreateFaDto): Promise<FA | null> {
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
  findAll(): Promise<FA[] | null> {
    return this.faService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a fa',
    type: Promise<FA | null>,
  })
  findOne(@Param('id', ParseIntPipe) id: string): Promise<FA | null> {
    return this.faService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Patch(':id')
  @ApiResponse({
    status: 201,
    description: 'Update a fa',
    type: Promise<FA | null>,
  })
  @ApiBody({
    description: 'Update a fa',
    type: UpdateFaDto,
  })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateFaDto: UpdateFaDto,
  ): Promise<FA | null> {
    return this.faService.update(+id, updateFaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete a fa',
    type: Promise<FA | null>,
  })
  remove(@Param('id', ParseIntPipe) id: string): Promise<FA | null> {
    return this.faService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Post('validate/:id')
  @ApiResponse({
    status: 201,
    description: 'Validate a fa',
    type: Promise<FA | null>,
  })
  //get id and user id from token
  validate(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: RequestWithUserPayload,
  ): Promise<FA | null> {
    const user_id = request.user.id;
    return this.faService.validateFa(id, user_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('orga')
  @Delete('validate/:id')
  @ApiResponse({
    status: 204,
    description: 'Unvalidate a fa',
    type: Promise<FA | null>,
  })
  unvalidate(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: RequestWithUserPayload,
  ): Promise<FA | null> {
    const user_id = request.user.id;
    return this.faService.unvalidateFa(id, user_id);
  }
}
