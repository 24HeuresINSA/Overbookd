import { Controller, Get, UseGuards, HttpCode } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from '../auth/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/permissions-auth.guard';
import { CollaboratorWithId } from './collaborator.model';
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
  findAll(): Promise<CollaboratorWithId[]> {
    return this.collaboratorService.findAll();
  }
}
