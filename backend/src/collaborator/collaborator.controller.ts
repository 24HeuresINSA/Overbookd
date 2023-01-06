import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  ParseIntPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Upsert a collaborator by id',
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
  @ApiBody({ type: [CreateCollaboratorDto] })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createCollaborator: CreateCollaboratorDto[],
  ): Promise<collaborator[] | null> {
    return this.collaboratorService.upsert(faId, createCollaborator);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a collaborator by id',
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
    description: 'Collaborator id',
    required: true,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.collaboratorService.remove(id);
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<collaborator | null> {
    return this.collaboratorService.findOne(id);
  }
}
