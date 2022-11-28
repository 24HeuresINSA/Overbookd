import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { collaborator } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('collaborator')
@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':faId')
  @ApiResponse({
    status: 201,
    description: 'Upsert a collaborator',
  })
  upsert(
    @Param('faId', ParseIntPipe) faId: string,
    @Body() createCollaboratorDto: CreateCollaboratorDto,
  ): Promise<collaborator | null> {
    return this.collaboratorService.upsert(+faId, createCollaboratorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all collaborators',
  })
  findAll(): Promise<collaborator[] | null> {
    return this.collaboratorService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a collaborator',
  })
  findOne(@Param('id', ParseIntPipe) id: string): Promise<collaborator | null> {
    return this.collaboratorService.findOne(+id);
  }
}
