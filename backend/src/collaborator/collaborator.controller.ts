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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { CollaboratorFormRequestDto } from './dto/collaboratorFormRequest.dto';
import { Collaborator } from './collaborator.model';

@ApiBearerAuth()
@ApiTags('fa')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('fa')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':faId/collaborator')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get a collaborator',
    type: CollaboratorFormRequestDto,
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  findOne(
    @Param('faId', ParseIntPipe) faId: number,
  ): Promise<Collaborator | null> {
    return this.collaboratorService.findOne(faId);
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId/collaborator')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Upsert a collaborator by fa id',
    type: CollaboratorFormRequestDto,
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  @ApiBody({
    description: 'Update the collaborator of fa',
    type: CollaboratorFormRequestDto,
  })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() collaborator: CollaboratorFormRequestDto,
  ): Promise<Collaborator> {
    return this.collaboratorService.upsert(faId, collaborator);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':faId/collaborator')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a collaborator by id',
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  remove(@Param('faId', ParseIntPipe) faId: number): Promise<void> {
    return this.collaboratorService.remove(faId);
  }
}
