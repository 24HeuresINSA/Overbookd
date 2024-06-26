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
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { PermissionRequestDto } from "./dto/permission.request.dto";
import { PermissionLinkRequestDto } from "./dto/permission-link.request.dto";
import { PermissionResponseDto } from "./dto/permission.response.dto";
import { PermissionService } from "./permission.service";
import { MANAGE_PERMISSIONS } from "@overbookd/permission";

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

  @Permission(MANAGE_PERMISSIONS)
  @Post("link/:id")
  @ApiResponse({
    status: 201,
    description: "Link a permission with different teams",
    type: PermissionResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "Permission id",
    type: Number,
  })
  @ApiBody({
    description: "Teams to link to the permission",
    type: PermissionLinkRequestDto,
  })
  async updatePermissionTeams(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: PermissionLinkRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.linkPermissionToTeam(id, payload.teamCodes);
  }
}
