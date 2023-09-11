import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { TeamRequestDto } from "./dto/team.request.dto";
import { LinkTeamToUserDto } from "./dto/link-team-user.dto";
import { TeamResponseDto } from "./dto/team.response";
import { TeamService } from "./team.service";
import { AFFECT_TEAM, MANAGE_TEAMS } from "@overbookd/permission";
import { RequestWithUserPayload } from "../app.controller";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";

@ApiTags("teams")
@Controller("teams")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all teams",
    type: TeamResponseDto,
    isArray: true,
  })
  async getTeams(
    @Query("permission") permission?: string,
  ): Promise<TeamResponseDto[]> {
    const where = buildQueryParamsCondition(permission);
    return this.teamService.team({ orderBy: { name: "asc" }, where });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_TEAM)
  @Post("link")
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Link a user with different teams",
    type: LinkTeamToUserDto,
  })
  async updateUserTeams(
    @Body() payload: LinkTeamToUserDto,
    @Request() req: RequestWithUserPayload,
  ): Promise<LinkTeamToUserDto> {
    return this.teamService.updateUserTeams(payload, new JwtUtil(req.user));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Create a team",
    type: TeamResponseDto,
  })
  async addTeam(@Body() payload: TeamRequestDto): Promise<TeamResponseDto> {
    return this.teamService.createTeam(payload);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Patch(":code")
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Update a team",
    type: TeamResponseDto,
  })
  async updateTeam(
    @Param("code") code: string,
    @Body() data: TeamRequestDto,
  ): Promise<TeamResponseDto> {
    return this.teamService.updateTeam(code, data);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Delete(":code")
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a team",
  })
  async deleteTeam(@Param("code") code: string): Promise<void> {
    return this.teamService.deleteTeam(code);
  }
}

function buildQueryParamsCondition(permission: string) {
  return permission
    ? {
        permissions: {
          some: {
            permissionName: permission,
          },
        },
      }
    : {};
}
