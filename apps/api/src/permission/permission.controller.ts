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
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { PermissionRequestDto } from './dto/permission.request.dto';
import { PermissionLinkResponseDto } from './dto/permission-link.response.dto';
import { PermissionResponseDto } from './dto/permission.response.dto';
import { PermissionService } from './permission.service';

@ApiTags('permissions')
@Controller('permissions')
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
    @Body() payload: PermissionRequestDto,
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
    @Body() payload: PermissionRequestDto,
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
    type: PermissionLinkResponseDto,
  })
  async updatePermissionTeams(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: PermissionLinkResponseDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.linkPermissionToTeam(id, payload.teamCodes);
  }
}
