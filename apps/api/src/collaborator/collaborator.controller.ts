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
  Put,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
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
import { Permission } from '../auth/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/permissions-auth.guard';
import { CollaboratorFormRequestDto } from './dto/collaboratorFormRequest.dto';
import { Collaborator } from './collaborator.model';
import { CollaboratorResponseDto } from './dto/collaboratorResponse.dto';

@ApiBearerAuth()
@ApiTags('collaborator')
@Controller('collaborator')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all collaborators',
    type: CollaboratorResponseDto,
    isArray: true,
  })
  findAll(): Promise<Collaborator[]> {
    return this.collaboratorService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get a collaborator',
    type: CollaboratorResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'collaborator id',
    required: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Collaborator | null> {
    return this.collaboratorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a collaborator',
    type: CollaboratorResponseDto,
  })
  @ApiBody({
    description: 'Create a collaborator',
    type: CollaboratorFormRequestDto,
  })
  create(
    @Body() collaboratorData: CollaboratorFormRequestDto,
  ): Promise<Collaborator> {
    return this.collaboratorService.create(collaboratorData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update a collaborator',
    type: CollaboratorResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'collaborator id',
    required: true,
  })
  @ApiBody({
    description: 'Update a collaborator',
    type: CollaboratorFormRequestDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() collaboratorData: CollaboratorFormRequestDto,
  ): Promise<Collaborator> {
    return this.collaboratorService.update(id, collaboratorData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Remove a collaborator',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'collaborator id',
    required: true,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.collaboratorService.remove(id);
  }
}
