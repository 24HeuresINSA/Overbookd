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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { PermissionFormDto } from './dto/permissionForm.dto';
import { PermissionLinkDto } from './dto/permissionLink.dto';
import { PermissionResponseDto } from './dto/permissionResponse.dto';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin')
  @Post()
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin')
  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(200)
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a permission',
    type: PermissionResponseDto,
  })
  async deletePermission(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionService.deletePermission(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin')
  @Post('link/:id')
  @ApiBearerAuth()
  @HttpCode(201)
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
