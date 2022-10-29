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
} from '@nestjs/common';
import { FaService } from './fa.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FA } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa')
export class FaController {
  constructor(private readonly faService: FaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post()
  @ApiBody({
    description: 'Create a new fa',
    type: CreateFaDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new fa',
    type: Promise<FA | null>,
  })
  create(@Body() createFaDto: CreateFaDto): Promise<FA | null> {
    return this.faService.create(createFaDto);
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
    status: 201,
    description: 'Delete a fa',
    type: Promise<FA | null>,
  })
  remove(@Param('id', ParseIntPipe) id: string): Promise<FA | null> {
    return this.faService.remove(+id);
  }
}
