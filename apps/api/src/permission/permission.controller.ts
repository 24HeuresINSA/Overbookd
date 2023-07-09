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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { PermissionFormDto } from './dto/permissionForm.dto';
import { PermissionLinkDto } from './dto/permissionLink.dto';
import { PermissionResponseDto } from './dto/permissionResponse.dto';
import { PermissionService } from './permission.service';

@ApiTags('permission')
@Controller('permission')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all permissions',
    type: PermissionResponseDto,
    isArray: true,
  })
  async getPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionService.permission({ orderBy: { name: 'asc' } });
  }

  @Permission('admin')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a permission',
    type: PermissionResponseDto,
  })
  async createPermission(
    @Body() payload: PermissionFormDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.createPermission(payload);
  }

  @Permission('admin')
  @Patch(':id')
  @HttpCode(200)
  @ApiNotFoundResponse({
    description: "Can't find a site publish animation resource",
  })
  @ApiResponse({
    status: 200,
    description: 'Update a permission',
    type: PermissionResponseDto,
  })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PermissionFormDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.updatePermission(id, payload);
  }

  @Permission('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse({
    description: "Can't find a site publish animation resource",
  })
  @ApiResponse({
    status: 204,
    description: 'Delete a permission',
    type: PermissionResponseDto,
  })
  async deletePermission(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionService.deletePermission(id);
  }

  @Permission('admin')
  @Post('link/:id')
  @HttpCode(201)
  @ApiNotFoundResponse({
    description: "Can't find a site publish animation resource",
  })
  @ApiResponse({
    status: 201,
    description: 'Link a permission with different teams',
    type: PermissionLinkDto,
  })
  async updatePermissionTeams(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PermissionLinkDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.linkPermissionToTeam(id, payload.teamCodes);
  }
}
