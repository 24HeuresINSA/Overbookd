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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { Permission } from '../../src/auth/permissions-auth.decorator';
import { PermissionsGuard } from '../../src/auth/permissions-auth.guard';
import { TeamFormDto } from './dto/teamFormRequest.dto';
import { LinkTeamToUserDto } from './dto/linkTeamUser.dto';
import { TeamResponseDto } from './dto/teamResponse';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all teams',
    type: TeamResponseDto,
    isArray: true,
  })
  async getTeams(
    @Query('permission') permission?: string,
  ): Promise<TeamResponseDto[]> {
    const where = buildQueryParamsCondition(permission);
    return this.teamService.team({ orderBy: { name: 'asc' }, where });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('affect-team')
  @Post('link')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Link a user with different teams',
    type: LinkTeamToUserDto,
  })
  async updateUserTeams(
    @Body() payload: LinkTeamToUserDto,
  ): Promise<LinkTeamToUserDto> {
    return this.teamService.updateUserTeams(payload);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('admin')
  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a team',
    type: TeamResponseDto,
  })
  async addTeam(@Body() payload: TeamFormDto): Promise<TeamResponseDto> {
    return this.teamService.createTeam(payload);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('admin')
  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update a team',
    type: TeamResponseDto,
  })
  async updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TeamFormDto,
  ): Promise<TeamResponseDto> {
    return this.teamService.updateTeam(id, data);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a team',
  })
  async deleteTeam(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teamService.deleteTeam(id);
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
