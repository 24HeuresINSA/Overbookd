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
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  Permission as AvailablePermission,
  MANAGE_PERMISSIONS,
} from "@overbookd/permission";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { PermissionRequestDto } from "./dto/permission.request.dto";
import { PermissionResponseDto } from "./dto/permission.response.dto";
import { PermissionService } from "./permission.service";
import { GrantPermissionRequestDto } from "./dto/grant-permission.request.dto";

@ApiTags("permissions")
@Controller("permissions")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Can't find a permission resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission(MANAGE_PERMISSIONS)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all permissions",
    type: PermissionResponseDto,
    isArray: true,
  })
  async getPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionService.permission({ orderBy: { name: "asc" } });
  }

  @Permission(MANAGE_PERMISSIONS)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Create a permission",
    type: PermissionResponseDto,
  })
  @ApiBody({
    description: "Permission to create",
    type: PermissionRequestDto,
  })
  async createPermission(
    @Body() payload: PermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.createPermission(payload);
  }

  @Permission(MANAGE_PERMISSIONS)
  @Patch(":id")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Update a permission",
    type: PermissionResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "Permission id",
    type: Number,
  })
  @ApiBody({
    description: "Updated permission",
    type: PermissionRequestDto,
  })
  async updatePermission(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: PermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.updatePermission(id, payload);
  }

  @Permission(MANAGE_PERMISSIONS)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a permission",
  })
  @ApiParam({
    name: "id",
    description: "Permission id",
    type: Number,
  })
  async deletePermission(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.permissionService.deletePermission(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERMISSIONS)
  @Post(":permission/teams")
  @ApiBearerAuth()
  @ApiBody({
    description: "team to grant the permission to",
    type: GrantPermissionRequestDto,
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Grant a permission to the team",
  })
  async grantPermissionToTeam(
    @Param("permission") permission: AvailablePermission,
    @Body() { team }: GrantPermissionRequestDto,
  ): Promise<void> {
    await this.permissionService.grant(permission).to(team);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_PERMISSIONS)
  @Delete(":permission/teams/:code")
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Revoke permission to the team",
  })
  async RevokePermissionToTeam(
    @Param("permission") permission: AvailablePermission,
    @Param("code") team: string,
  ): Promise<void> {
    await this.permissionService.revoke(permission).from(team);
  }
}
